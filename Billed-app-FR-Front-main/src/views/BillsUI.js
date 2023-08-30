import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'

const Month = [
  "Jan" , "Fév" , "Mar" , "Avr",
  "Mai" , "Jui" , "Jul" , "Aoû",
  "Sep" , "Oct" , "Nov" , "Déc"
];

function parseDate(d) {
  let dd = d.substring(0 , 2);
  if(dd < 10) {
    dd = "0"+ dd;
  }
  dd = dd.replace(" " , "")
  let mm = d.substring(d.indexOf(" ")+1 , d.indexOf(" ") + 4)
  let i = 0;
  Month.forEach(items => {
    if(mm == items) {
      mm = i + 1;
      if(mm < 10) {
        mm = "0" + mm
      }
    }
    i++
  });
  let yyyy = d.substring(d.indexOf(".") + 1 , d.length)
  if(parseInt(yyyy) > 23) {
    yyyy = "19" + yyyy;
  } else if(parseInt(yyyy) < 23) {
    yyyy = "20" + yyyy;
  }
  yyyy = yyyy.replace(" " , "");
  let final = dd + "/" + mm + "/" + yyyy
  return final
}


const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
  }




const rows = (data) => { //parse la date pour trier par date
  data?.forEach(element => {
    console.log(element.date)
    parseDate(element.date)
  });

  data?.sort((a , b) => {
    return a.date > b.date ? -1 : 1;
  })
  
  return (data && data.length) ? data.map(bill => row(bill)).join("") : "" ;
}

export default ({ data: bills, loading, error }) => {
  
  const modal = () => (`
    <div  data-testid="modaleFile" class="modal fade" id="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }
  
  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}