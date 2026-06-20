const cron = require("node-cron");
const userRepository = require("../Repository/userRepository");
const postRepository = require("../Repository/postRepository");
const postItTodoRepository = require("../Repository/postItTodoRepository");

const startPostItScheduler = () => {
    // 토, 일 제외 매일 새벽 4시 (월~금)
    // cron.schedule("*/1 * * * *", async () => {
    cron.schedule("0 4 * * 1-5", async () => {
        console.log("⏰ Running Daily Post-It Scheduler at KST 04:00 (Mon-Fri)");
        try {
            // 1. 모든 가입 사용자 조회
            const users = await userRepository.findAll();

            // 한국 시간(KST, +09:00) 기준 오늘 날짜 문자열(YYYY-MM-DD) 생성
            const offset = 9 * 60 * 60 * 1000;
            const todayKst = new Date(Date.now() + offset);
            const todayStr = todayKst.toISOString().split('T')[0];

            for (const user of users) {
                // 2. 해당 유저의 가장 최근 포스트잇 1개 조회
                const { items: postIts } = await postRepository.findByUserId(user.id, 1, 1);
                const latestPostIt = postIts[0];

                let latestPostItDateStr = "";
                if (latestPostIt && latestPostIt.created_at) {
                    if (latestPostIt.created_at instanceof Date) {
                        const dateKst = new Date(latestPostIt.created_at.getTime() + offset);
                        latestPostItDateStr = dateKst.toISOString().split('T')[0];
                    } else {
                        // 문자열인 경우 (e.g. "2026-06-21 00:00:00")
                        latestPostItDateStr = String(latestPostIt.created_at).substring(0, 10);
                    }
                }

                const isLatestPostItFromToday = latestPostIt && latestPostItDateStr === todayStr;

                // 3. 오늘 날짜로 생성된 포스트잇이 없다면 새로 생성
                if (!isLatestPostItFromToday) {
                    const newPostIt = await postRepository.create(user.id);
                    console.log(`✅ Generated today's post-it for User ID: ${user.id} (PostIt ID: ${newPostIt.id})`);

                    // 4. 이전 포스트잇이 존재하면 미완료된 todo를 새 포스트잇에 매핑
                    if (latestPostIt) {
                        const copiedCount = await postItTodoRepository.copyUncompletedTodos(latestPostIt.id, newPostIt.id);
                        console.log(`➡️ Transferred ${copiedCount} uncompleted todos from PostIt ID ${latestPostIt.id} to ${newPostIt.id} for User ID: ${user.id}`);
                    }
                }
            }
        } catch (error) {
            console.error("❌ Error in Daily Post-It Scheduler:", error);
        }
    }, {
        scheduled: true,
        timezone: "Asia/Seoul"
    });
};

module.exports = { startPostItScheduler };
