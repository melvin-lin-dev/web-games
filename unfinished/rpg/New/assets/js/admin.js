let url = 'assets/php/';
let selectedFile;

window.onload = () => {
	loadPage('textures');
}

function ajax(file, type, data, id = '', extra = {}){
	$.ajax({
		url: url + file + '_process.php',
		type,
		data,
		...extra.ajax,
		success: (response) => {
			if(id){
				$(`#${id}`).html(response);
			}else{
				loadPage(extra.page);
			}
		}
	})
}

function loadPage(value){
	let data = {
		page: value.toLowerCase(),
		action: 'Load Page'
	};

	ajax('texture', 'post', data, 'page');
}

function saveTexture(){
	let data = {
		file: selectedFile,
		pass: $('#texture-pass').val(),
		action: 'Save Texture'
	};

	let formData = new FormData();
	for(let key in data){
		formData.append(key, data[key]);
	}

	let extra = {
		ajax: {
		    processData: false,
		    contentType: false,
		},
		page: 'textures'
	}

	ajax('texture', 'post', formData, '', extra);
}

function onChangeFile(e){
	selectedFile = e.target.files[0];
}