import { createWebHashHistory, createRouter } from "vue-router";
import Dashboard from "./components/Dashboard.vue";
import CByRemetente from "./components/Conhecimento/ByRemetente";
import MessageTest from "./components/Conhecimento/MessageTest";
export const routes = [
    {
        path: "/dash",
        component: Dashboard,
        titulo: "Dash",

    },


    {
        path: "/conhecimento/byRemetente",
        component: CByRemetente

    },
    {
        path: "/conhecimento/message",
        component: MessageTest

    },
    {
        path: "/:catchAll(.*)",
        component: Dashboard,
    }

];
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;