Weather App ☂️⛅☀️
תיאור הפרויקט:
אפליקציה לחיזוי מזג האוויר בזמן אמת לפי שם עיר.
הפרויקט מבוסס על React בצד הלקוח ו-Node.js בצד השרת.
האפליקציה מציגה את מזג האוויר הנוכחי,
 טמפרטורות לשעות הקרובות והשוואה לשעות קודמות.

טכנולוגיות:
Frontend: React, Vite
Backend: Node.js, Express
State Management: React Hooks
API: WeatherAPI
Request Library: Axios
Environment Variables: dotenv
CORS: מאפשר בקשות בין צד השרת לצד הלקוח

כיצד להשתמש:

צד הלקוח:
הזן את שם העיר בתיבת הטקסט בצד הלקוח.
לאחר שליחה, תוצג טמפרטורה של מזג האוויר הנוכחי בעיר המבוקשת.
האפליקציה מציגה גם את הטמפרטורות 
לשעה הקרובה והשוואה למזג האוויר בשעות הקודמות.

צד השרת:
השרת מקבל בקשות GET ל-
 /weather/:city, כאשר city הוא שם העיר.
לדוגמה, בקשה לעיר "Tel Aviv" תהיה:
GET /weather/Tel Aviv

איך להריץ את הפרויקט?
1️⃣ התקנת התלויות:
cd client
npm install

cd ../server
npm install

2️⃣ הגדרת מפתחות API:

הפרויקט דורש מפתח API כדי להתחבר ל-WeatherAPI.
רישום לחשבון ב-WeatherAPI

הוסף את המפתח שלך לקובץ .env בתיקיית השרת:
API_KEY=YOUR_API_KEY

3️⃣ הרצת הפרויקט:
פתח שני טרמינלים:

טרמינל ראשון (שרת):
cd server
node server.js

טרמינל שני (לקוח):
cd client
npm run dev

