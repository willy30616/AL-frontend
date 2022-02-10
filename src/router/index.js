import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Cust from "@/views/BaseSetting/Cust.vue";
// import apple from '../components/ProductDesigner/Material/Doorleaf_Edit'

Vue.use(VueRouter);

const routes = [{
        path: "/",
        name: "Home",
        component: Home
    },
    //客戶
    {
        path: "/cust",
        name: "Cust",
        component: Cust
    },
    //材料
    {
        path: "/material",
        name: "Material",
        component: () =>
            import ("../views/ProductDesigner/Material.vue")
    },
    //門扇
    {
        path: "/doorleaf",
        name: "Doorleaf",
        component: () =>
            import ("../views/ProductDesigner/DoorLeaf.vue")
    },
    {
        path: "/doorleaf/view/:id",
        name: "DoorleafView",
        component: () =>
            import ("../components/ProductDesigner/DoorLeaf/DoorLeafView.vue")
    },
    {
        path: "/doorleaf/add",
        name: "DoorleafAdd",
        component: () =>
            import ("../components/ProductDesigner/DoorLeaf/DoorLeafAdd.vue")
    },
    {
        path: "/doorleaf/:id",
        name: "DoorleafEdit",
        component: () =>
            import ("../components/ProductDesigner/DoorLeaf/DoorLeafEdit.vue")
    },

    //門框
    {
        path: "/frame",
        name: "frame",
        component: () =>
            import ("../views/ProductDesigner/Frame.vue")
    },
    {
        path: "/frame/add",
        name: "frameAdd",
        component: () =>
            import ("../components/ProductDesigner/Frame/FrameAdd.vue")
    },
    {
        path: "/frame/:id",
        name: "frameEdit",
        component: () =>
            import ("../components/ProductDesigner/Frame/FrameEdit.vue")
    },
    {
        path: "/frame/view/:id",
        name: "frameView",
        component: () =>
            import ("../components/ProductDesigner/Frame/FrameView.vue")
    },

    //報價
    {
        path: "/quotation",
        name: "Quotation",
        component: () =>
            import ("../views/Quotation.vue")
    },
    {
        path: "/quotate/add",
        name: "Quotationadd",
        component: () =>
            import ("../components/Quotate/QuotateAdd.vue")
    },
    {
        path: "/quotate/edit/:id",
        name: "QuotationEdit",
        component: () =>
            import ("../components/Quotate/QuotateEdit.vue")
    },
    {
        path: "/quotate/view/:id",
        name: "QuotationView",
        component: () =>
            import ("../components/Quotate/QuotateView.vue")
    },

    //產品
    {
        path: "/product",
        name: "Product",
        component: () =>
            import ("../views/BaseSetting/Product.vue")
    },

    {
        path: "/product/add",
        name: "ProductAdd",
        component: () =>
            import ("../components/Product/ProductAdd.vue")
    },
    {
        path: "/product/view/:id",
        name: "ProductView",
        component: () =>
            import ("../components/Product/ProductView.vue")
    },
    {
        path: "/product/edit/:id",
        name: "ProductEdit",
        component: () =>
            import ("../components/Product/ProductEdit.vue")
    },
    //setting
    {
        path: "/setting/material",
        name: "MaterialCategory",
        component: () =>
            import ("../components/Setting/Setting.vue")
    }
];

const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes
});

export default router;