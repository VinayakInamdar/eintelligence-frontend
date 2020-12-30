
const Home = {
    text: 'Dashboard',
    link: '/home',
    icon: 'fas fa-home',
};
const User = {
    text: 'User',
    link: '/user',
    icon: "fa fa-user"
};
const Account = {
    text: 'Account',
    link: '/account',
    icon: "fa fa-user-plus",
    // submenu: [
    //     {
    //         text: 'Account Setting',
    //          link: '/account/accountsetting'
    //     },
    //     {
    //         text: 'Branding',
    //         link: '/account/branding'
    //     }
    // ]
};

const Fulfillment = {
    text: 'Fulfillment',
    link: '/store',
    icon: "fas fa-store"
};
const Products = {
    text: 'Products',
    link: '/products',
    icon: "fas fa-store"
};
const MyPayments = {
    text: 'My Payments',
    link: '/mypayments',
    icon: "fas fa-store"
};
// const Admin = {
//     text: 'Admin',
//     link: '/admin',
//     icon: "fas fa-user-shield"
// };

const Campaign = {
    text: 'Projects',
    link: '/campaign',
    icon: "fa fa-bullhorn"
};

 const Integrations = {
    text: 'Integrnations',
     link: '/integrations/:id',
     icon: "fas fa-cogs"
 };

const Leads = {
    text: 'CRM',
    link: '/leads',
    icon: "fa fa-book"
};

const Proposal = {
    text: 'Proposal',
    link: '/proposal',
    icon: "fas fa-sticky-note"
};
const Todolist = {
    text: 'Tasks',
    link: '/todo',
    icon: "fas fa-list-alt"
};

const Reports = {
    text: 'Reports',
    link: '/reports',
    icon: "fas fa-list-alt"
};



// const Register = {
//     text: 'Register',
//     link: '/register',
//     //icon: "icon-user"
// };
// const Success = {
//     text: 'Success',
//     link: '/success',
//     //icon: "icon-user"
// };
// const Settings = {
//     text: "Settings",    
//     icon: "icon-settings",
//     submenu: [
//         {
//             text: 'User',
//             icon: "icon-user",
//             link: '/user'
//         }        
//     ]
// };

const headingMain = {
    text: 'Main Navigation',
    heading: true
};

export const menu = [
    headingMain,
    Home,
    Campaign,
    Fulfillment, 
    Reports,
    User,
    Account,
  //  Store,
    //Admin,
   
   Integrations,
    Leads,
    Proposal,
    Todolist,
    Products,
    MyPayments
   
];
