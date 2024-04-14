class Calendar {
    constructor() {
        this.week = ["日", "月", "火", "水", "木", "金", "土"];
        this.today = new Date();
        this.holidayList = [];
        this.eventdayList = [];
        this.closingdayList = [];

        // 今年、今月、今月の1日、今日の曜日を取得
        this.showDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
    }

    async init() {
        // 祝日CSVデータの読み込み
        this.holidayList = await this.loadCSVData('/csv/holiday.csv');
        // イベントCSVデータの読み込み
        this.eventdayList = await this.loadCSVData('/csv/eventday.csv');
        // 休館日CSVデータの読み込み
        this.closingdayList = await this.loadCSVData('/csv/closingday.csv');
        
        // ボタンのセットアップ
		const $calendarPrev = document.querySelector('.calendar_prev');
		const $calendarNext = document.querySelector('.calendar_next');

        // 前の月表示
        $calendarPrev.onclick = () => {
            this.calendarPrev();
        };

        // 次の月表示
        $calendarNext.onclick = () => {
            this.calendarNext();
        };

        // 初期表示
        this.showProcess(this.today);
    }

    async loadCSVData(csvUrl) {
        try {
            const response = await fetch(csvUrl);
            const csvText = await response.text();
            const csvData = this.parseCSVData(csvText);
       
            return csvData;
      
        } catch (error) {
          console.error('CSVデータの読み込みに失敗しました:', error);
        }
    }

    parseCSVData(csvText) {
        const rows = csvText.split('\n');
        const data = rows.map(row => row.split(','));
        return data;
    }

    calendarPrev() {
        this.showDate.setMonth(this.showDate.getMonth() - 1);
        this.showProcess(this.showDate);
    }

    calendarNext(){
        this.showDate.setMonth(this.showDate.getMonth() + 1);
        this.showProcess(this.showDate);
    }

    showProcess(date) {
        let year = date.getFullYear();
        let month = date.getMonth();
        document.querySelector('#calendar_header').innerHTML = year + "年 " + (month + 1) + "月";
    
        let calendar = this.createProcess(year, month);
        document.querySelector('#calendar').innerHTML = calendar;
    }

    // カレンダー作成
    createProcess(year, month) {
        // 曜日
        let calendar = "<table><tr class='dayOfWeek'>";
        for (let i = 0; i < this.week.length; i++) {
            calendar += "<th>" + this.week[i] + "</th>";
        }
        calendar += "</tr>";

        let count = 0;
        let startDayOfWeek = new Date(year, month, 1).getDay();             // 月初の曜日を取得 0 〜 6
        let endDate = new Date(year, month + 1, 0).getDate();               // 月末の日付を取得
        let lastMonthEndDate = new Date(year, month, 0).getDate();          // 先月末の日付を取得

        let row = Math.ceil((startDayOfWeek + endDate) / this.week.length); // カレンダーが何行になるか計算

        // カレンダー作成
        for (let i = 0; i < row; i++) {
            calendar += "<tr>";

            for (let j = 0; j < this.week.length; j++) {
                if (i == 0 && j < startDayOfWeek) {
                    // 1行目の先月の日付を設定
                    calendar += "<td class='disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
                
                } else if (count >= endDate) {
                    // 最終行の月末日以降に翌月の日付を設定
                    count++;
                    calendar += "<td class='disabled'>" + (count - endDate) + "</td>";

                } else {
                    count++;
                    let dateInfo = this.checkDate(year, month, count);       // 日付チェック

                    if(dateInfo.isToday){
                        // 本日のセル背景を赤くする
                        calendar += "<td class='today'>" + count + "</td>"; 

                    } else if(dateInfo.isEventday){
                        // イベント日のセル背景を緑にする
                        calendar += "<td class='eventDay'>" + count + "<span class='balloon'>" + dateInfo.holidayName + "</span>" + "</td>"; 
                    
                    } else if(dateInfo.isClosingday){
                        // 休館日のセル背景をグレーにする
                        calendar += "<td class='closingDay'>" + count + "<span class='balloon'>" + dateInfo.holidayName + "</span>" + "</td>"; 

                    } else if (dateInfo.isHoliday) {
                         // 祝日の日付文字を赤くする
                        calendar += "<td class='holiday' title='" + dateInfo.holidayName + "'>" + count + "</td>";

                    } else {
                        // それ以外は普通
                        calendar += "<td>" + count + "</td>";               
                    }
                }
            }
            calendar += "</tr>";
        }
        return calendar;
    }

    // 日付チェック
    checkDate(year, month, day) {
        let checkDate = {
            isToday: false,
            isEventday: false,
            isHoliday: false,
            isClosingday: false,
            holidayName: ""
        };

        // 本日のチェック
        if (this.isToday(year, month, day)){
            checkDate.isToday = true;
        }

        // 祝日のチェック
        let checkHoliday = this.isHoliday(year, month, day);
        checkDate.isHoliday = checkHoliday[0];                  // true/false
        checkDate.holidayName = checkHoliday[1];

        // イベント日のチェック
        let checkEventday = this.isEventday(year, month, day);
        checkDate.isEventday = checkEventday[0];                // true/false
     
        if (checkDate.isEventday) {
            checkDate.holidayName = checkEventday[1];           // イベント日のみイベント名を上書きする
        }

        // 休館日のチェック
        let checkisClosingday = this.isClosingday(year, month, day);
        checkDate.isClosingday = checkisClosingday[0];                  // true/false
        if (checkDate.isClosingday) {
            checkDate.holidayName = checkisClosingday[1];
        }
      
        return checkDate;
    }

    // 当日かどうか
    isToday(year, month, day) {
        return (year == this.today.getFullYear()
            && month == (this.today.getMonth())
            && day == this.today.getDate());
    }

    // 祝日かどうか
    isHoliday(year, month, day) {
        let checkDate = year + '/' + (month + 1) + '/' + day;
    
        // 1行目はヘッダーのため飛ばす
        for (var i = 1; i < this.holidayList.length; i++) {
            if (this.holidayList[i][0] === checkDate) {
                return [true, this.holidayList[i][1]];
            }
        }
        return [false, ""];
    }

    // イベント日かどうか
    isEventday(year, month, day) {
        let checkDate = year + '/' + (month + 1) + '/' + day;
    
        // 1行目はヘッダーのためとばす
        for (var i = 1; i < this.eventdayList.length; i++) {
            if (this.eventdayList[i][0] === checkDate) {
                return [true, this.eventdayList[i][1]];
            }
        }
        return [false, ""];
    }

    // 休館日かどうか
    isClosingday(year, month, day) {
        let checkDate = year + '/' + (month + 1) + '/' + day;
    
        // 1行目はヘッダーのためとばす
        for (var i = 1; i < this.closingdayList.length; i++) {
            if (this.closingdayList[i][0] === checkDate) {
                return [true, this.closingdayList[i][1]];
            }
        }
        return [false, ""];
    }
}

// サイドメニューのDOM描写完了後にカレンダーを作成する
const initCalendarWhenContentLoaded = (retryCount = 0) => {
    const targetNode = document.getElementById('insertSideMenu');
   
    if (targetNode) {
        
        // DOMの監視オプションを指定する
        const observerConfig = {
        childList: true,                    // 子ノードの変化を監視する
        subtree: true                       // 子孫ノードの変化も監視する
        };

        // DOMの変化が検出された時に呼び出されるコールバック関数
        const observerCallback = (mutationsList, observer) => {
            for (const mutation of mutationsList) {                 // nutationsList：検出された変更のリスト
                if (mutation.type === 'childList') {                // childListの変更があるかどうか
                    new Calendar().init();                          // カレンダーを作成する
                    observer.disconnect();                          // 監視を停止する
                    break;
                }
            }
        };

        const observer = new MutationObserver(observerCallback);    // インスタンスを作成
        observer.observe(targetNode, observerConfig);               // 監視を開始する
    
    } else if (retryCount < 10)  {
         // 親要素が無い時、再試行は10回まで                           
        console.log('retryCount='+retryCount);

        setTimeout(() => {
            initCalendarWhenContentLoaded(retryCount + 1);
        }, 500);                                                  // 500ミリ秒後に回数カウントアップして再実行する
    
    } else if  (retryCount >= 10) {
        // カレンダー作成に失敗した時、エラーメッセージ出力
        console.error('サイドメニュー読み込みエリアがありません', error);
    }
};

initCalendarWhenContentLoaded();
  
