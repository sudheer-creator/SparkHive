import React from 'react';

const MultiColumnLayout = () => {
  return (
    <div class="flex flex-row ">
  <div class="relative column-1 w-1/12 h-screen bg-custom-blue bg-blue-500 justify-center">
    <div class="flex flex-col items-center py-4 bg-blue-900 mb-20">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house text-white h-6 w-6" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z" />
        <path fill-rule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z" />
      </svg>
    </div>
    <a href="#" class="flex flex-col items-center py-4 my-4 hover:bg-blue-700 hover:cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-image-fill h-4 w-4 text-white" viewBox="0 0 16 16">
        <path d="M.002 3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V3zm1 9v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12zm5-6.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0z" />
      </svg>
    </a>
    <a href="#" class="flex flex-col items-center py-4 my-4 hover:bg-blue-700 hover:cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal h-4 w-4 text-white" viewBox="0 0 16 16">
        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
      </svg>
    </a>
    <a href="#" class="flex flex-col items-center py-4 my-4 hover:bg-blue-700 hover:cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-lightning-charge-fill h-4 w-4 text-white" viewBox="0 0 16 16">
        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z" />
      </svg>
    </a>
    <a href="#" class="flex flex-col items-center py-4 my-4 hover:bg-blue-700 hover:cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-award-fill h-4 w-4 text-white" viewBox="0 0 16 16">
        <path d="m8 0 1.669.864 1.858.282.842 1.68 1.337 1.32L13.4 6l.306 1.854-1.337 1.32-.842 1.68-1.858.282L8 12l-1.669-.864-1.858-.282-.842-1.68-1.337-1.32L2.6 6l-.306-1.854 1.337-1.32.842-1.68L6.331.864 8 0z" />
        <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
      </svg>
    </a>
    <a href="#" class="flex flex-col items-center py-4 my-4 hover:bg-blue-700 hover:cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bag-plus-fill h-4 w-4 text-white" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M10.5 3.5a2.5 2.5 0 0 0-5 0V4h5v-.5zm1 0V4H15v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4h3.5v-.5a3.5 3.5 0 1 1 7 0zM8.5 8a.5.5 0 0 0-1 0v1.5H6a.5.5 0 0 0 0 1h1.5V12a.5.5 0 0 0 1 0v-1.5H10a.5.5 0 0 0 0-1H8.5V8z" />
      </svg>
    </a>
<div class="absolute bottom-0">
      <img src="https://i.pravatar.cc/150?img=3" class="h-8 w-8 rounded-full" />
    </div> 
  </div>
  <div class="flex flex-col md:flex-row w-11/12">
    <div class="column-2 w-full md:w-6/12 h-full border-2 border-dashed md:mx-2 my-2 rounded-md"></div>
    <div class="column-3 w-full md:w-5/12 h-full border-2 border-dashed md:mx-2 my-2 rounded-md"></div>
  </div>
</div>
  );
};

export default MultiColumnLayout;
