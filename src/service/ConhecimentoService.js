import httpAxiosService from "./HttpAxiosService";

export default class ConhecimentoService {

   
    findByRemetente(cnpj){
        // var uri= this.baseUrl +"conhecimentos/rest/findByRemetente/"+cnpj;
        // axios.get(uri).then(response =>{
        //     console.log("status " + response.status);
        //     console.log("status " + response.data);
        // });
        let uri = "/conhecimentos/findByRemetente/"+cnpj;
      
      return  httpAxiosService.get(uri).then(response => response.data);
        
    }
}