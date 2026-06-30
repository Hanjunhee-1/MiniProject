const cron = require("node-cron");
const userRepository = require("../Repository/userRepository");
const postRepository = require("../Repository/postRepository");
const postItTodoRepository = require("../Repository/postItTodoRepository");
const todoRepository = require("../Repository/todoRepository");

/**
 * 매일 새벽 4시 실행
 * 미완료 Todo의 elapsed_date 증가
 */
const runElapsedDateScheduler = async () => {
    console.log("⏰ Running Elapsed Date Scheduler");

    const updatedCount = await todoRepository.incrementElapsedDays();
    console.log(`✅ Updated elapsed_date for ${updatedCount} todos.`);
};

/**
 * 월~금 새벽 4시 실행
 * Post-It 생성 및 미완료 Todo 복사
 */
const runPostItScheduler = async () => {
    console.log("⏰ Running Post-It Scheduler");

    // 관리자가 아닌 가입 사용자만 조회
    const users = await userRepository.findAllNonAdmin();

    const offset = 9 * 60 * 60 * 1000;
    const todayKst = new Date(Date.now() + offset);
    const todayStr = todayKst.toISOString().split("T")[0];

    for (const user of users) {
        // 가장 최근 Post-It 조회
        const { items: postIts } = await postRepository.findByUserId(
            user.id,
            1,
            1
        );

        const latestPostIt = postIts[0];

        let latestPostItDateStr = "";

        if (latestPostIt?.created_at) {
            if (latestPostIt.created_at instanceof Date) {
                const dateKst = new Date(
                    latestPostIt.created_at.getTime() + offset
                );
                latestPostItDateStr = dateKst.toISOString().split("T")[0];
            } else {
                latestPostItDateStr = String(
                    latestPostIt.created_at
                ).substring(0, 10);
            }
        }

        const isLatestPostItFromToday =
            latestPostIt && latestPostItDateStr === todayStr;

        if (!isLatestPostItFromToday) {
            const newPostIt = await postRepository.create(user.id);

            console.log(
                `✅ Generated today's post-it for User ID: ${user.id} (PostIt ID: ${newPostIt.id})`
            );

            if (latestPostIt) {
                const copiedCount =
                    await postItTodoRepository.copyUncompletedTodos(
                        latestPostIt.id,
                        newPostIt.id
                    );

                console.log(
                    `➡️ Transferred ${copiedCount} uncompleted todos from PostIt ID ${latestPostIt.id} to ${newPostIt.id} for User ID: ${user.id}`
                );
            }
        }
    }
};

const startPostItScheduler = () => {
    // 매일 새벽 4시
    cron.schedule(
        "0 4 * * *",
        // test용 cron
        // "*/1 * * * *",
        async () => {
            try {
                // 1. 매일 elapsed_date 증가
                await runElapsedDateScheduler();

                // 2. 주말이면 Post-It 생성은 하지 않음
                const weekDay = new Date().getDay(); // 0:일 ~ 6:토

                if (weekDay >= 1 && weekDay <= 5) {
                    await runPostItScheduler();
                } else {
                    console.log("📅 Weekend - Skipping Post-It Scheduler");
                }
            } catch (error) {
                console.error("❌ Scheduler Error:", error);
            }
        },
        {
            timezone: "Asia/Seoul",
        }
    );
};

module.exports = {
    startPostItScheduler,
};