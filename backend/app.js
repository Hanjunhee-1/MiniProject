require("dotenv").config();

const express = require("express");
const cors = require("cors");
const prefix = require("./Utils/prefix");
const initDB = require("./Database/initDatabase");
const { startPostItScheduler } = require("./Scheduler/postItScheduler");

const app = express();

const routers = [
    require("./Route/authRoutes"),
    require("./Route/postRoutes")
]

app.use(cors());
app.use(express.json());

// 구글 로그인 테스트용 임시 HTML 페이지
app.get("/", (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Google Login Test</title>
            <script src="https://accounts.google.com/gsi/client" async defer></script>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f0f2f5; margin: 0; }
                .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; max-width: 400px; width: 100%; }
                h2 { margin-bottom: 20px; color: #1a1a1a; }
                pre { background: #2d3748; color: #f7fafc; padding: 15px; border-radius: 6px; text-align: left; overflow-x: auto; max-height: 250px; font-size: 13px; }
                .signin-container { display: flex; justify-content: center; margin-bottom: 25px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Google Login Test</h2>
                <div class="signin-container">
                    <div id="g_id_onload"
                         data-client_id="${process.env.GOOGLE_CLIENT_ID}"
                         data-callback="handleCredentialResponse">
                    </div>
                    <div class="g_id_signin" data-type="standard"></div>
                </div>
                <p style="text-align: left; font-weight: bold; margin-bottom: 5px;">응답 결과:</p>
                <pre id="result">구글 로그인을 완료해 주세요...</pre>
            </div>

            <script>
                function handleCredentialResponse(response) {
                    document.getElementById("result").innerText = "토큰 검증 및 백엔드 전송 중...";
                    
                    fetch("/auth", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ token: response.credential })
                    })
                    .then(res => res.json())
                    .then(data => {
                        document.getElementById("result").innerText = JSON.stringify(data, null, 2);
                    })
                    .catch(err => {
                        document.getElementById("result").innerText = "에러 발생: " + err.message;
                    });
                }
            </script>
        </body>
        </html>
    `);
});


// auth
app.use(prefix.AUTH, routers[0]);

// post-it
app.use(prefix.POST_IT, routers[1]);

// DB 연결 및 서버 가동
const startServer = async () => {
    try {
        // DB 연결 완료될 때까지 대기
        await initDB();

        // 포스트잇 및 미완료 투두 이관 스케줄러 자동 실행
        startPostItScheduler();

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    } catch (e) {
        console.error(e);
    }
}

startServer();