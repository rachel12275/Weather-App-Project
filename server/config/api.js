import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY;
const BASE_URL = "http://api.weatherapi.com/v1";
export const fetchWeather = async (city) => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=1&aqi=no&alerts=no`);
        //שליפת השעה העגולה הנוכחית
        const localTimeStr = response.data.location.localtime;
        const currentHour = parseInt(localTimeStr.split(" ")[1].split(":")[0], 10);
        console.log(currentHour);

        const relevantHours = [];

        for (let i = -3; i <= 1; i++) {
            const targetHour = (currentHour + i + 24) % 24; // חישוב השעה על פי ה-i (שלושה שעות לפני, שעה נוכחית ואחריה)
            const hourData = response.data.forecast.forecastday[0].hour.find(
                (hour) => new Date(hour.time).getHours() === targetHour
            );
            if (hourData) {
                relevantHours.push({
                    time: hourData.time.split(" ")[1], // הזמן בפורמט 24 שעות
                    temp: hourData.temp_c,
                });
            }
        }
        console.log(relevantHours);

        //שליפת תאריך נוכחי
        const localDateStr = localTimeStr.split(" ")[0];
        // חישוב תאריך אתמול על פי התאריך המקומי של העיר
        let yesterdayTemps = {};
        let tomorrowTemp = {};
        if (currentHour <= 2) {
            const localDate = new Date(localDateStr);
            localDate.setDate(localDate.getDate() - 1); // הפחתת יום אחד
            const yesterdayDate = localDate.toLocaleDateString('en-CA');
            // שליחת התאריך של אתמול לפונקציה
            const yesterdayWeather = await fetchYesterdayWeather(city, yesterdayDate);
            const yesterdayHours = yesterdayWeather?.forecast?.forecastday?.[0]?.hour || [];
            // שליפת טמפרטורות לשעות 21, 22, 23
            yesterdayTemps = {
                "21:00": yesterdayHours.find(h => h.time.endsWith("21:00"))?.temp_c || "N/A",
                "22:00": yesterdayHours.find(h => h.time.endsWith("22:00"))?.temp_c || "N/A",
                "23:00": yesterdayHours.find(h => h.time.endsWith("23:00"))?.temp_c || "N/A"
            };
            console.log("Yesterday's Temperatures:", yesterdayTemps);
        }
        if (currentHour == 23) {
            const tomorrowWeather = await fetchTomorrowWeather(city);
            const tomorrowHours = tomorrowWeather.forecast.forecastday[1].hour;// התחזית עבור יום המחר (היום השני)      
            tomorrowTemp = {
                "00:00": tomorrowHours.find(h => h.time.endsWith("00:00"))?.temp_c || "N/A"
            }
            console.log("Tomorrow's Temperatures:", tomorrowTemp);

        }


        relevantHours.forEach(hour => {//מחליף באם קימות שעות קצה בטמפרטורות הרלוונטיות
            if (hour.time === "00:00" && tomorrowTemp["00:00"] !== undefined) {
                hour.temp = tomorrowTemp["00:00"];
            } else if (["21:00", "22:00", "23:00"].includes(hour.time) && yesterdayTemps[hour.time] !== undefined) {
                hour.temp = yesterdayTemps[hour.time];
            }
        });
        console.log(relevantHours);


        return { data: response.data, times: relevantHours };
    } catch (error) {
        console.log("Connection failed", error);
    }
};


export const fetchYesterdayWeather = async (city, date) => {
    try {
        const response = await axios.get(`${BASE_URL}/history.json?key=${API_KEY}&q=${city}&dt=${date}`);
        return response.data;
    } catch (error) {
        console.log("Connection failed", error);
    }
};


export const fetchTomorrowWeather = async (city) => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast.json?key=${API_KEY}&q=${city}&days=2&aqi=no&alerts=no`);
        const forecastDays = response.data.forecast.forecastday;

        if (forecastDays.length < 2) {
            throw new Error("No forecast available for tomorrow.");
        }

        return response.data;
    } catch (error) {
        console.log("Connection failed", error);
    }
};







