function Exporter_ExportWord({
    url, 
    method="POST", 
    data={}, 
    async=true,
    success,error, 
    before,finish
}) {

    const token=
        localStorage.getItem("WebToken")!==""
            ? localStorage.getItem("WebToken")
            :getCookie("WebToken");

    if(before) before();

    fetch(url,{
        method: method,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    })
        .then(async (response) => {
            if(!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const blob=await response.blob();
            const url=window.URL.createObjectURL(blob);
            const a=document.createElement("a");
            a.href=url;
            a.download="example.docx"; 
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            if(success) success(); 
            if(finish) finish(null); 
        })
        .catch((error) => {
            if(error) error(); 
            if(finish) finish(error); 
        });
}