class Contents {
	constructor() {
	}
	
	init(){
		this.displayContents(`/parts/header.html`,`insertHeader`);
		this.displayContents(`/parts/sideMenu.html`,`insertSideMenu`);
		this.displayContents(`/parts/footer.html`,`insertFooter`);
		this.displayContents(`/parts/copyright.html`,`insertCopyright`);
	}
	
	// コンテンツ読み込み
	displayContents(url , selector) {	
		let box = document.getElementById(selector);
		let xhr = new XMLHttpRequest();
		const method = "GET";

		xhr.open(method, url, true);							// 非同期だとtrue, 同期だとfalse
		xhr.onreadystatechange = () => {
			if(xhr.readyState === 4 && xhr.status === 200) {				
				box.innerHTML = xhr.responseText;
			}
		};
		xhr.send();
	}
}

window.addEventListener('load', () => {
	new Contents().init();
});
