
const Home = {
    text: 'Home',
    link: '/home',
    icon: 'icon-home'
};
const User = {
    text: 'User',
    link: '/user',
    icon: "icon-user"
};
const Account = {
    text: 'Account',
    link: '/account',
    icon: "icon-user-follow",
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
    User,
    Account
];
