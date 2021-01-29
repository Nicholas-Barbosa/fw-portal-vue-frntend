import httpAxiosService from "./HttpAxiosService";

export default class ConhecimentoService {

   
    findByRemetente(cnpj,page,sortOrder,sortField){
        // var uri= this.baseUrl +"conhecimentos/rest/findByRemetente/"+cnpj;
        // axios.get(uri).then(response =>{
        //     console.log("status " + response.status);
        //     console.log("status " + response.data);
        // });
       
       
        let uri = "/conhecimentos/findByRemetente/"+cnpj+"?page="+page+"&sort="+sortField+","+sortOrder;
      
          
      return  httpAxiosService.get(uri).then(response => response.data);
        
    }
}