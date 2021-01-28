import { createWebHashHistory , createRouter } from "vue-router";
import Dashboard from "./components/Dashboard.vue";


export const routes = [
    {
        path:"/dash",
        component:Dashboard,
        titulo:"Dash",
        
    },

    {
        path: "/:catchAll(.*)",
        component: Dashboard,
    }
   
];
const router = createRouter({
    history: createWebHashHistory (),
    routes,
  });
  
  export default router;