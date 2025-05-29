import React, { useEffect } from "react";
import useTheme from '../../hooks/useTheme';
const SystemSettings = () => {

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme])

  const toggleTheme = () => {
    if (theme === 'light')
      setTheme('dark');
    else
      setTheme('light');
  }

  return (
    <div className="h-auto w-auto  ">
      <div className="h-full w-full flex items-center justify-center">
        <div className="h-full w-full  border-gray-300 shadow-xl flex flex-col gap-2">
          <div className="mt-2 flex flex-col gap-8">
            <div className="ml-5 mr-5 relative">
              <div className="border border-gray-200 h-11 mb-4 flex justify-between items-center px-4"
                    style={{borderRadius: '10px'}}>
                <span className="text-[var(--login-text-color)]">Theme mode</span>
                {/* <input type="checkbox" value="synthwave" class="toggle"/> */}
                <label class="flex cursor-pointer gap-2" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
                  <input type="checkbox" checked={theme === 'dark'}
                    className="toggle bg-amber-200 border-sky-400
                    
                  [--tglbg:theme(colors.sky.400)] checked:bg-blue-300 checked:border-blue-800 
                  checked:[--tglbg:theme(colors.blue.900)]" onChange={toggleTheme} />
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
