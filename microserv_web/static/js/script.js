/* Retrieving manipulated HTML elements by their 'id' */
const codeInput = document.getElementById("code") ; // Postcode text field
const nameInput = document.getElementById("name") ; // Municipality name text field
const loadInput = document.getElementById("load") ; // Validation button
const suggestResult = document.getElementById("suggestion") ; // Layer of the suggestion list
const propertiesPanel = document.getElementById("properties") ; // Layer of the municipality's property notice board

let searchArray = [];

async function getByCode(){
    propertiesPanel.innerHTML = '';
    propertiesPanel.style.display = "none";
    nameInput.value = '';
    searchArray = [];

    let url = `${window.origin}/suggest`;   // Prepare the URL from the initial loading of the page
    let entry = {                           // JavaScript object to send in the request body 
        code: codeInput.value               // Representation of the name of the municipality
    };

    let options = {                             // Object to initialise the AJAX promise  
        method: "POST",                         // HTTP request method 
        body: JSON.stringify(entry),            // Adding to the request body the 'entry' JavaScript object as a JSON string
        headers: new Headers({                  // Adding HTTP header 
            "content-type": "application/json"  //specifying the sending type of JSON data
        })
    };

    /* Asynchronous use of the AJAX JavaScript Promise to retrieve municipality from their postal code */
    await fetch(url, options)
    .then((response) => {               // Data processing callback retrieve 
        if(response.status !== 200){
            console.log(`No response receive -> status ${response.status}`);
            return ;
        }
        response.json().then(data => {
            searchArray = data;
           if(searchArray.length>0 && nameInput.disabled){
                nameInput.disabled = !nameInput.disabled;
                loadInput.disabled = !loadInput.disabled;
            }
        })
    });
}

/* Load in suggestion's list the municipality whose name matched with the entry value */
function getByName(){
    const input = nameInput.value;
    const result = searchArray.filter(item => item.mun_name.toLocaleLowerCase().includes(input.toLocaleLowerCase()));
    
    let suggestions = '';

    if(input != ''){
        result.forEach(resultItem =>
            suggestions += `<li onclick="loadChoice('${resultItem.mun_name}')">${resultItem.mun_name}</li>`
        )
    }
    suggestResult.innerHTML = "<ul>"+suggestions+"</ul>";
}

/* Validate the choice*/
function loadChoice(valeur){
    nameInput.value=valeur;
    suggestResult.innerHTML="";
}

/* Find the municipality in searchArray by its name and display its properties in properties panel */
function showProperties(){
    let municipality = {};
    searchArray.forEach(resultItem => {
        if(resultItem.mun_name.toLocaleLowerCase() == nameInput.value.toLocaleLowerCase()){
            municipality = resultItem;
        }
    })
    propertiesPanel.innerHTML = `
    <h2>Commune de ${municipality.mun_name}</h2>
    <div id="affiche">
        <h3>Données administratives</h3>
        <ul>
            <li>nom de commune : ${municipality.mun_name}</li>
            <li>Identifiant INSEE  : ${municipality.insee_code}</li>
            <li>Code postal  : ${municipality.mun_code}</li>
            <li>Département  : ${municipality.dept.dept_name} (${municipality.dept.dept_id})</li>
            <li>Région  : ${municipality.dept.region.region_name} (${municipality.dept.region.region_id})</li>
        </ul>
        <h3>Coordonnées géographiques GPS</h3>
        <ul>
            <li>Longitude : ${municipality.gps_lng}</li>
            <li>Lattitude : ${municipality.gps_lat}</li>
        </ul>
    </div>
    `;
    propertiesPanel.style.display = "block";
    searchArray = [];
    municipality = {};
}

/* Field's deactivation */
function deactivateFields(){
    nameInput.value='';
    nameInput.disabled="true";
    loadInput.disabled="true";
}

/* Setting up event listening */
codeInput.addEventListener('focus', deactivateFields);
codeInput.addEventListener('blur', getByCode);
nameInput.addEventListener('input', getByName);
loadInput.addEventListener('click', showProperties);