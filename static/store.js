document.addEventListener('readystatechange', function(event) {
    getToken();
    if (document.readyState === "complete") {

    get_json_data();
    }
});

//Selectors
const authToken = document.querySelector(".auth-token");
const storeIdInput = document.querySelector(".store-input-id");
const storeInput = document.querySelector(".store-input");
const searchstoreButton = document.querySelector(".search-store-button");
const addstoreButton = document.querySelector(".add-store-button");
const updatestoreButton = document.querySelector(".update-store-button");
const storeList = document.querySelector(".store-list");
const storeNameInput = document.querySelector(".store-input-name");
const storeAddressInput = document.querySelector(".store-input-address");
const storePhoneInput = document.querySelector(".store-input-phone");
const storeTable = document.querySelector(".table");


//Event Listeners
searchstoreButton.addEventListener("click", SearchStore);
addstoreButton.addEventListener("click", AddStore);
updatestoreButton.addEventListener("click", UpdateStore);


//Fucntions
function ListStore(event){
    event.preventDefault();

    var xhr = new XMLHttpRequest();
        xhr.open("GET", "/stores", true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.onreadystatechange = function () {
          if (xhr.readyState != 4 || xhr.status != 200) return;
            console.log("Success: " + xhr.responseText);
            const data = JSON.parse(xhr.responseText);
            storeList.innerHTML = '';
             for (var i=0;i<data.stores.length;i++) {
                 var li =document.createElement('li')
                 li.textContent = data.stores[i].name;
                 li.innerHTML += '<button class="btn btn-default" onclick="deleteStore(this,'+data.stores[i].id+')">Eliminar</button>';
                 storeList.appendChild(li);
                }

            // log response
            console.log(data);


        };
        xhr.send();
}



function AddStore(){
    event.preventDefault();
    name_store = storeNameInput.value;
    address_store = storeAddressInput.value;
    phone_store = storePhoneInput.value;

    var xhr = new XMLHttpRequest();
        xhr.open("POST", "/store/create", true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
         var responseObject = JSON.parse(this.response);
          if (xhr.status == 201){
            alert("Success: " + xhr.responseText);
            document.getElementById("frm-add-store").reset();
          }else
          {
            alert("Message: " + xhr.responseText);
          }

        };
        var sendObject = JSON.stringify({'name': name_store,'address': address_store,'phone': phone_store});
        console.log(sendObject);
        xhr.send(sendObject);
}

function getToken() {
  var loginUrl = "/auth"
  var xhr = new XMLHttpRequest();
  var userElement = "lrios";
  var passwordElement = "sistemas";
  var tokenElement = document.getElementById('token');
  var user = userElement;
  var password = passwordElement;

  xhr.open('POST', loginUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.addEventListener('load', function() {
    var responseObject = JSON.parse(this.response);
    console.log(responseObject);
    if (responseObject.access_token) {
      document.querySelector(".auth-token").value = responseObject.access_token;
    } else {
      authToken = "No token received";
    }
  });

  var sendObject = JSON.stringify({'username': user, 'password': password});

  console.log('going to send', sendObject);

  xhr.send(sendObject);
}

function deleteStore(object, store_id){
    var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/store/"+store_id, true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
         var responseObject = JSON.parse(this.response);
          if (xhr.status == 200){
            alert("Success: " + xhr.responseText);
            get_json_data();
            return
          }else{
          alert("Message: " + xhr.responseText);
          }
        };
        var sendObject = JSON.stringify({'mensaje': 'Dato envíadp'});
        console.log(sendObject);
        xhr.send();

}

function loadStore(){
           var xhr = new XMLHttpRequest();
        xhr.open("GET", "/stores", true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.onreadystatechange = function () {
          if (xhr.readyState != 4 || xhr.status != 200) return;
            console.log("Success: " + xhr.responseText);
            const data = JSON.parse(xhr.responseText);
            storeSelect.innerHTML = '';
            var option =document.createElement('option');
            storeSelect.textContent="-----------";
            storeSelect.appendChild(option);
             for (var i=0;i<data.stores.length;i++) {
                 option =document.createElement('option');
                 option.textContent = data.stores[i].name;
                 option.value = data.stores[i].id;
                 storeSelect.appendChild(option);
                }
            // log response
            console.log(data);
        };
       var sendObject = JSON.stringify(null);
        console.log(sendObject);
        xhr.send();

 };


   //this function is in the event listener and will execute on page load
        function get_json_data(){
            // Relative URL of external json file
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/stores", true);
            xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {//when a good response is given do this

                    var data = JSON.parse(this.responseText); // convert the response to a json object
                    append_json(data.stores);// pass the json object to the append_json function
                }
            }
            // send the request
            xhr.send(); // when the request completes it will execute the code in onreadystatechange section
        }

        //this function appends the json data to the table 'gable'
        function append_json(data){
            var table = document.getElementById('storeTable');
            resetTable();
            data.forEach(function(object) {
                var tr = document.createElement('tr');
                tr.innerHTML = '';
                tr.innerHTML = '<td>' + object.id + '</td>' +
                '<td>' + object.name + '</td>' +
                '<td>' + object.address + '</td>' +
                '<td>' + object.phone + '</td>' +
                '<td>' + object.items.length + '</td>'+
                '<td>'+'<button class="btn btn-default" onclick="deleteStore(this,'+object.id+')">Eliminar</button>'+'</td>'+
                '<td>'+'<button class="btn btn-default" onclick="editStore(this,'+object.id+')">Editar</button>'+'</td>';
                table.appendChild(tr);
            });
        }

      function resetTable(){
     var table = document.getElementById("storeTable");
            while (table.rows.length > 1) {
              table.deleteRow(1);
            }
      }

function SearchStore(event){
    store_name = storeInput.value;
    event.preventDefault();
    search_store_url = "/stores/search/"+store_name
    if (storeInput.value.length === 0){
    search_store_url = "/stores"
    }

      // Relative URL of external json file
            var xhr = new XMLHttpRequest();
            xhr.open("GET", search_store_url, true);
            xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {//when a good response is given do this
                    var data = JSON.parse(this.responseText); // convert the response to a json object
                    append_json(data.stores);// pass the json object to the append_json function
                }
            }
            // send the request
            xhr.send(); // when the request completes it will execute the code in onreadystatechange section
}

function editStore(object, store_id){

      // Relative URL of external json file
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/store/"+store_id, true);
            xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {//when a good response is given do this
                    var data = JSON.parse(this.responseText); // convert the response to a json object
                    setInputStore(data);// pass the json object to the append_json function
                }
            }
            // send the request
            xhr.send(); // when the request completes it will execute the code in onreadystatechange section
}

function setInputStore(data){
     storeIdInput.value = data.id;
     storeNameInput.value = data.name;
     storeAddressInput.value = data.address;
     storePhoneInput.value = data.phone;
}

function UpdateStore(){
    store_id = storeIdInput.value;
    name_store = storeNameInput.value;
    address_store = storeAddressInput.value;
    phone_store = storePhoneInput.value;
    var xhr = new XMLHttpRequest();
        xhr.open("PUT", "/store/"+store_id, true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
         var responseObject = JSON.parse(this.response);
          if (xhr.status == 201){
            alert("Success: " + xhr.responseText);
            document.getElementById("frm-add-store").reset();
          }else
          {
            alert("Message: " + xhr.responseText);
          }

        };
        var sendObject = JSON.stringify({'name': name_store,'address': address_store,'phone': phone_store});
        console.log(sendObject);
        xhr.send(sendObject);
}



