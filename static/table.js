<script>

        //this function is in the event listener and will execute on page load
        function get_json_data(){
            // Relative URL of external json file
            xhr.open("GET", "/stores", true);
            xhr.setRequestHeader("Authorization", "JWT "+ authToken.value);
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {//when a good response is given do this

                    var data = JSON.parse(this.responseText); // convert the response to a json object
                    append_json(data);// pass the json object to the append_json function
                }
            }
            //set the request destination and type
            xmlhttp.open("POST", json_url, true);
            //set required headers for the request
            xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            // send the request
            xmlhttp.send(); // when the request completes it will execute the code in onreadystatechange section
        }

        //this function appends the json data to the table 'gable'
        function append_json(data){
            var table = document.getElementById('table');
            data.forEach(function(object) {
                var tr = document.createElement('tr');
                tr.innerHTML = '<td>' + object.id + '</td>' +
                '<td>' + object.name + '</td>' +
                '<td>' + object.address + '</td>' +
                '<td>' + object.items + '</td>';
                table.appendChild(tr);
            });
        }
    </script>