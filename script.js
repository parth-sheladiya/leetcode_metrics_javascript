document.addEventListener("DOMContentLoaded" , function(){
    const searchBtn = document.getElementById('btnSearch');
    const userInput = document.getElementById('inputUser');
    const statusContainer = document.querySelector('.status-container');
    const easyProgressCircle = document.querySelector('.easy-circle');
    const mediumProgressCircle = document.querySelector('.medium-circle');
    const hardProgressCircle = document.querySelector('.hard-circle');
    const easyLabel = document.getElementById('easy-label');
    const mediumLabel = document.getElementById('medium-label');
    const hardLabel = document.getElementById('hard-label');
    const TotalProgressCircle = document.querySelector('.total-circle')
    const totalLabel = document.getElementById('total-label')
    

    // valid user or not 
    function validUsernameOrNot(userName){
        if(userName.trim() === ""){
            alert("Username should not empty");
            return false;
        }
        // below regular expression
        const regularExpression = /^[a-zA-Z0-9_]{5,20}$/;

        const isCorrectUsername = regularExpression.test(userName);
        if(!isCorrectUsername){
            alert("Invalid  Username")
        }
        return isCorrectUsername; 
    }
    
    // api through function 
    // async function fetchUserDetails(userName){
    //     searchBtn.textContent="Searching...";
    //     searchBtn.disabled = true;
    //     // url takes on github
    //     const leetcodeUrl =  `https://leetcode.com/graphql/`
    //     try{
    //         const response = await fetch(leetcodeUrl);
    //         if(!response){
    //             throw new Error("Unable to fetch leetcode user details")
    //         }
    //         const parseData = await response.json();
    //         console.log("loggin data",parseData);

    //         displayUserData(parseData);
    //     }catch(error){
    //         statusContainer.innerHTML = `<p>No data found</p>`
    //     }
    //     finally{
    //         searchBtn.textContent="search";
    //         searchBtn.disabled = false;
    //     }
    // }

    
async function fetchUserDetails(userName){
   
    // url takes on github
    try{
        
        searchBtn.textContent="Searching...";
        searchBtn.disabled = true;

        const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
        const targetUrl = 'https://leetcode.com/graphql/';
        // concatinate url
        
        const myHeaders = new Headers();
        myHeaders.append("content-type", "application/json");

        const graphql = JSON.stringify({
            query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
            variables: { "username": `${userName}` }
        })
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: graphql,
            redirect:"follow"
        };

        const response =  await fetch(proxyUrl+targetUrl , requestOptions)

        if(!response.ok){
            throw new Error("Unable to fetch leetcode user details")
        }
        const responceData = await response.json();
        console.log("loggin data",responceData);

        displayUserData(responceData);
    }catch(error){
        console.error("read some error",error);
        statusContainer.innerHTML = `<p>No data found</p>`
    }
    finally{
        searchBtn.textContent="search";
        searchBtn.disabled = false;
    }
}
    function updateProgressOnUi(solved , total , label , circle){
        const progressDegree = (solved/total)*100;
        circle.style.setProperty("--progess-degree" , `${progressDegree}%`);
        label.textContent = `${solved}/${total}`;
    }
    function displayUserData(responceData){
        const totalQuestion = responceData.data.allQuestionsCount[0].count;
        const totalEasyQuestion = responceData.data.allQuestionsCount[1].count;
        const totalMediumQuestion = responceData.data.allQuestionsCount[2].count;
        const totalHardQuestion = responceData.data.allQuestionsCount[3].count;

        const myTotalQuesSolved = responceData.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const myEasyQuesSolved = responceData.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const myMediumQuesSolved = responceData.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const myHardQuesSolved = responceData.data.matchedUser.submitStats.acSubmissionNum[3].count;


        
        updateProgressOnUi(myEasyQuesSolved , totalEasyQuestion , easyLabel , easyProgressCircle);
        updateProgressOnUi(myMediumQuesSolved , totalMediumQuestion, mediumLabel , mediumProgressCircle);
        updateProgressOnUi(myHardQuesSolved,totalHardQuestion,hardLabel , hardProgressCircle);
        updateProgressOnUi(myTotalQuesSolved,totalQuestion, totalLabel ,TotalProgressCircle )
    }

    searchBtn.addEventListener('click',function(){
        const userName = userInput.value;
        console.log(userName);
        // user validate 
        if(validUsernameOrNot(userName)){
            fetchUserDetails(userName);
        }
    })

})