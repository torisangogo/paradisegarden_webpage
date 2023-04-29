// メインメニュー
class Menu {
	constructor(tabSelector){
		this.tabSelector = tabSelector;
	}
	
	// 指定タブをアクティブにする
	activateTab(){
		const number = this.tabSelector.dataset.number;
		let chosenTab = document.querySelector(`#menu_parent li:nth-child(${number})`);
		
		chosenTab.classList.add('main_menu_active');
	}
}

// ヘッダーのDOM描写完了後にメニューをアクティブにする
const initMenuWhenContentLoaded = (retryCount = 0) => {
    const targetNode = document.getElementById('insertHeader');
   
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
					// Menuインスタンス作成
					const menu = new Menu(document.getElementById('menu_active'));
                	menu.activateTab();                           	// タブをアクティブにする
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
            initMenuWhenContentLoaded(retryCount + 1);
        }, 500);                                                  	// 500ミリ秒後に回数カウントアップして再実行する
    
    } else if  (retryCount >= 10) {
        // タブのアクティブ化に失敗した時、エラーメッセージ出力
        console.error('ヘッダーメニュー読み込みエリアがありません', error);
    }
};

initMenuWhenContentLoaded();


