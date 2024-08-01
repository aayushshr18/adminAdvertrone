export const mapNavbarData = (data)=>{
    return {
        header : 'Advertrone Technologies Admin Panel',
        navbarItems : [
            {
                to: '/',
                paths: [''],
                title: 'Dasboard',
                icon: 'home_icon',
                id: 'navitem-1'
            },
            {
                to: '/employees',
                paths: ['employees'],
                title: 'Assigement',
                icon: 'employees_icon',
                id: 'navitem-2'
            },
            {
                to: '/balance',
                paths: ['balance'],
                title: 'Update Balance',
                icon: 'balance_icon',
                id: 'navitem-3'
            },
            {
                to: '/departments',
                paths: ['departments'],
                title: 'Update Leads',
                icon: 'departments_icon',
                id: 'navitem-4'
            },
            
            {
                to: '/balancetl',
                paths: ['balancetl'],
                title: 'TL Balance',
                icon: 'balance_icon',
                id: 'navitem-5'
            },
            {
                to: '/requeststl',
                paths: ['requeststl'],
                title: 'Requests TL',
                icon: 'tasks_icon',
                id: 'navitem-6'
            },
            {
                to: '/projects',
                paths: ['projects'],
                title: 'Registration req.',
                icon: 'projects_icon',
                id: 'navitem-7'
            },
            {
                to: '/createdata',
                paths: ['createdata'],
                title: 'Create Bulk Data',
                icon: 'cdata_icon',
                id: 'navitem-8'
            },{
                to: '/tasks',
                paths: ['tasks'],
                title: 'Withrawal req.',
                icon: 'tasks_icon',
                id: 'navitem-10'
            },
            {
                to: '/profile',
                paths: ['profile'],
                title: 'Note',
                icon: 'profile_icon',
                id: 'navitem-11'
            },
        ],
        employeeName: data?.name ?? '😎'
    }
}