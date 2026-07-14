
import React, { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { useTheme } from '../context/ThemeContext';

type LayoutProps = {
  children: ReactNode;
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-background ${theme}`}>
      <Navbar />
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.key}
          timeout={400}
          classNames="page-transition"
        >
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20">
            {children}
          </main>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};
