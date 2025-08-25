import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from './Sidebar';

const MainLayout: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="m-0 font-sans text-base antialiased font-normal dark:bg-slate-900 leading-default bg-gray-50 text-slate-500">
      {/* Background décoratif */}
      <div className="absolute w-full min-h-75" style={{ backgroundColor: '#071D26' }}></div>
      
      {/* Sidebar */}
      <Sidebar open={true} />
      
      {/* Contenu principal */}
      <main className="ease-nav-brand relative h-full max-h-screen rounded-xl transition-all duration-200 xl:ml-68">
        {/* Navbar */}
        <nav className="relative flex flex-wrap items-center justify-between px-0 py-2 mx-6 transition-all shadow-none duration-250 ease-nav-brand lg:flex-nowrap lg:justify-start">
          <div className="flex items-center justify-between w-full px-4 py-1 mx-auto flex-wrap-inherit">
            <nav>
              {/* Breadcrumb */}
              <ol className="flex flex-wrap pt-1 mr-12 bg-transparent rounded-lg sm:mr-16">
                <li className="text-sm leading-normal">
                  <a className="opacity-50 text-white" href="#">Pages</a>
                </li>
                <li className="text-sm pl-2 capitalize leading-normal text-white before:float-left before:pr-2 before:text-white before:content-['/']" aria-current="page">
                  Dashboard
                </li>
              </ol>
              <h6 className="mb-0 font-bold capitalize text-white">Dashboard</h6>
            </nav>

            <div className="flex items-center mt-2 grow sm:mt-0 sm:mr-6 md:mr-0 lg:flex lg:basis-auto">
              <div className="flex items-center md:ml-auto md:pr-4">
                <div className="relative flex flex-wrap items-stretch w-full transition-all rounded-lg ease-nav-brand">
                  <span className="text-sm ease-nav-brand z-index-2 leading-5.6 absolute z-50 -ml-px flex h-full items-center whitespace-nowrap rounded-lg rounded-tr-none rounded-br-none border border-r-0 border-transparent bg-transparent py-2 px-2.5 text-center font-normal text-slate-500 transition-all">
                    <i className="fas fa-search"></i>
                  </span>
                  <input type="text" className="pl-9 text-sm focus:shadow-primary-outline ease-nav-brand w-1/100 leading-5.6 relative -ml-px block min-w-0 flex-auto rounded-lg border border-solid border-gray-300 bg-white bg-clip-padding py-2 pr-3 text-gray-700 transition-all placeholder:text-gray-500 focus:border-blue-500 focus:outline-none focus:transition-shadow" placeholder="Rechercher..." />
                </div>
              </div>
              <ul className="flex flex-row justify-end pl-0 mb-0 list-none md-max:w-full">
                {/* Notifications */}
                <li className="flex items-center">
                  <a className="block p-0 text-sm text-slate-500 transition-all ease-nav-brand" href="#">
                    <i className="cursor-pointer fa fa-bell"></i>
                  </a>
                </li>
                
                {/* Profile */}
                <li className="flex items-center px-4">
                  <a className="block p-0 text-sm text-slate-500 transition-all ease-nav-brand" href="#">
                    <i className="cursor-pointer fa fa-user sm:mr-1"></i>
                    <span className="hidden sm:inline">Profil</span>
                  </a>
                </li>

                {/* Settings */}
                <li className="flex items-center xl:hidden">
                  <a href="#" className="block p-0 text-sm text-slate-500 transition-all ease-nav-brand">
                    <div className="w-4.5 overflow-hidden">
                      <i className="ease-nav-brand relative block h-0.5 rounded-sm bg-slate-500 transition-all"></i>
                      <i className="ease-nav-brand relative block h-0.5 rounded-sm bg-slate-500 transition-all my-1"></i>
                      <i className="ease-nav-brand relative block h-0.5 rounded-sm bg-slate-500 transition-all"></i>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Contenu des pages */}
        <div className="w-full px-6 py-6 mx-auto">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="py-12">
          <div className="mx-6">
            <div className="flex flex-wrap items-center justify-center -mx-3">
              <div className="w-full max-w-full px-3 mt-0 mb-6 shrink-0">
                <div className="text-sm leading-normal text-center text-slate-500">
                  © {new Date().getFullYear()} - Focus Technology Solutions
                </div>
              </div>

            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default MainLayout; 
