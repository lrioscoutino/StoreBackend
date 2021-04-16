document.addEventListener('readystatechange', function(event) {
    if (event.target.readyState === "complete") {
         getToken();
    }

});

//Selectors
const storeSelect = document.querySelector(".select-store");
const authToken = document.querySelector(".auth-token");
const itemInput = document.querySelector(".item-input");
const itemIdInput = document.querySelector(".item-input-id");
const searchitemButton = document.querySelector(".search-item-button");
const additemButton = document.querySelector(".add-item-button");
const updateitemButton = document.querySelector(".update-item-button");
const itemList = document.querySelector(".item-list");
const itemNameInput = document.querySelector(".item-input-name");
const itemPriceInput = document.querySelector(".item-input-price");
const itemStoreInput = document.querySelector(".item-input-store");


//Event Listeners
additemButton.addEventListener("click", AddItem);
//searchitemButton.addEventListener("click", ListItem);
storeSelect.addEventListener("change", ListItem);
updateitemButton.addEventListener("click", UpdateItem)

//Fucntions
function AddItem(){
    event.preventDefault();
    name_item = itemNameInput.value;
    price_item = itemPriceInput.value;
    store_item = storeSelect.value;
     var xhr = new XMLHttpRequest();
        xhr.open("POST", "/item/create", true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
         var responseObject = JSON.parse(this.response);
          if (xhr.status == 201){
            alert("Success: " + xhr.responseText);
            document.getElementById("frm-add-item").reset();
          }else
          {
            alert("Message: " + xhr.responseText);
          }

        };
        var sendObject = JSON.stringify(
                {
                'name': name_item,
                'price': price_item,
                'store_id': store_item
                }
        );
        console.log(sendObject);
        xhr.send(sendObject);
        ListItem();
}

function ListItem(){
            get_json_data();
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
     loadStore();
  });

  var sendObject = JSON.stringify({'username': user, 'password': password});

  console.log('going to send', sendObject);

  xhr.send(sendObject);
}

function deleteItem(object, item_id){
    var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "/item/"+item_id, true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
         var responseObject = JSON.parse(this.response);
          if (xhr.status == 200){
            alert("Success: " + xhr.responseText);
            object.parentNode.remove()
            return
          }else{
          alert("Message: " + xhr.responseText);
          }

        };
        var sendObject = JSON.stringify(null);
        console.log(sendObject);
        xhr.send(sendObject);
        ListItem();
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
        xhr.send(sendObject);
        };


//this function is in the event listener and will execute on page load
        function get_json_data(){
            // Relative URL of external json file
           store_id = storeSelect.value;
           var xhr = new XMLHttpRequest();
            xhr.open("GET", "/items/"+store_id, true);
            xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {//when a good response is given do this

                    var data = JSON.parse(this.responseText); // convert the response to a json object
                    append_json(data.items);// pass the json object to the append_json function
                }
            }
            // send the request
            xhr.send(); // when the request completes it will execute the code in onreadystatechange section
        }

  //this function appends the json data to the table 'itemTable'
        function append_json(data){
            var table = document.getElementById('itemTable');
            resetTable();
            data.forEach(function(object) {
                var tr = document.createElement('tr');
                tr.innerHTML = '';
                tr.innerHTML = '<td>' + object.id + '</td>' +
                '<td>' + object.store_name + '</td>' +
                '<td>' + object.name + '</td>' +
                '<td>' + object.price + '</td>' +
                '<td><button class="btn btn-default" onclick="deleteItem(this,'+object.id+')">Eliminar</button></td>'+
                '<td>'+'<button class="btn btn-default" onclick="editItem(this,'+object.id+')">Editar</button>'+'</td>';
                table.appendChild(tr);
            });
        }

     function resetTable(){
     var table = document.getElementById("itemTable");
            while (table.rows.length > 1) {
              table.deleteRow(1);
            }
      }


function editItem(object, item_id){

      // Relative URL of external json file
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "/item/"+item_id, true);
            xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {//when a good response is given do this
                    var data = JSON.parse(this.responseText); // convert the response to a json object
                    setInputItem(data);// pass the json object to the append_json function
                }
            }
            // send the request
            xhr.send(); // when the request completes it will execute the code in onreadystatechange section
}


   function setInputItem(data){
     itemIdInput.value = data.id;
     itemNameInput.value = data.name;
     itemPriceInput.value = data.price;
}

function UpdateItem(){
    item_id = itemIdInput.value;
    name_item = itemNameInput.value;
    price_item = itemPriceInput.value;
    store_id_item = storeSelect.value;
    var xhr = new XMLHttpRequest();
        xhr.open("PUT", "/item/"+item_id, true);
        xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.onreadystatechange = function () {
         var responseObject = JSON.parse(this.response);
          if (xhr.status == 201){
            alert("Success: " + xhr.responseText);
            document.getElementById("frm-add-item").reset();
          }else
          {
            alert("Message: " + xhr.responseText);
          }

        };
        var sendObject = JSON.stringify(
                {
                'name': name_item,
                'price': price_item,
                'store_id':store_id_item
                }
        );
        console.log(sendObject);
        xhr.send(sendObject);
        get_json_data();
}

