document.getElementById("SearchTextValue").addEventListener("input", (event) => {
    SearchUpdate(event.target.value);
});
let svalue = [
    'Math', 'Science', 'English', 'Social Science', 'Odia', 'Physics', 'Chemistry', 'Biology', 'Mathematics', 'IT-Information Technology', 'Accountancy', 'Business Study', 'Economics',
    'Political Science', 'Geography', 'History', 'Sociology', 'Philosophy', 'General Studies', 'Reasoning', 'Quantitative Aptitude', 'Ethics', 'Current Affair',
    'NCERT Science', 'General Awareness', 'C Programming', 'C++', 'Java', 'JavaScript', 'Python', 'Data Structure', 'Oracle', 'Networking', 'Cloud Computing', 'Cyber Security',
    'Web Programming', 'Admission Query', 'College Choice Query', 'Academic Query', 'Other'];
function updateSub(event,tag) {
    event.stopPropagation();
    if ([...event.target.parentElement.classList].includes("asuggestionse")) {
        event.target.parentElement.classList.remove("asuggestionse");
    } else {
        event.target.parentElement.classList.add("asuggestionse");
    }
    let va = [...document.getElementsByClassName("asuggestionse")].map(elem => { return elem.children[0].innerHTML; });
    aUpdateSub(`${va.join(" ")}`);
}
function aUpdateSub(tag) {
    document.getElementById("SearchTextValue").value = tag;
    SearchUpdate(tag);
}
let interval = setInterval(() => { aUpdateSub(document.getElementById("SearchTextValue").value) }, 2000);
function loadMoreSuggestions() {
    let elem = document.getElementById("sexpands");
    if (elem.children[0].innerHTML.startsWith("more")) {
        let val = [...document.getElementsByClassName("asuggestion")].map(elem => { return elem.children[0].innerHTML });
        let text = "";
        for (let i = 0; i < svalue.length; i++) {
            if (!val.includes(svalue[i])) {
                text = text + `<div class="suggestions asuggestion"><span onclick="updateSub(event,'${svalue[i]}')">${svalue[i]}</span></div>`;
            }
        }
        elem.insertAdjacentHTML("beforebegin", text);
        elem.children[0].innerHTML = "Less...";
    } else {
        let ssvalue = ["Math", "Physics", "Chemistry", "Biology"];
        let text = "";
        for (let i = 0; i < ssvalue.length; i++) {
            text = text + `<div class="suggestions asuggestion"><span onclick="updateSub(event,'${ssvalue[i]}')">${ssvalue[i]}</span></div>`;
        }
        text = text + `<div class="suggestions suggestion-load-btn" id="sexpands"><span onclick="loadMoreSuggestions()">more..</span></div>`;
        elem.parentElement.innerHTML = text;
    }
}
function reloadRequests() {
    document.getElementById("SearchTextValue").value = "";
    aUpdateSub("");
}
function SearchUpdate(tag) {
    fetch("/teacher-search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ tag: tag })
    }).then(resp => {
        return resp.json()
    }).then(data => {
        if ((data && data.length) || (data.length == 0)) {
            let text = "";
            for (let i = 0; i < data.length; i++) {
                if (!Filtered.includes(data[i].url)) {
                    text = text + `<div class="request">
                        <div class="left-section">
                            <div class="request-image">
                            </div>
                            <div class="details-section">
                                <div class="request-question">
                                    <span></span>
                                </div>
                                <div class="details">
                                    <div class="list ">
                                        <h6>${data[i].desc}</h6>
                                    </div>
                                    <div class="list ">
                                        <h6>${data[i].course}</h6>
                                    </div>
                                    <div class="list ">
                                        <h6>${data[i].subject}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="right-section">
                            <div class="join-btn">
                                <button class="btn btn-success">
                                    <a onclick="replace_history('/t/${data[i].url}')">Join</a>
                                </button>
                                <button onclick="filter_ques('${data[i].url}')" class="btn btn-danger">Remove</button>
                            </div>
                        </div>
                    </div>`
                }
            };
            document.getElementsByClassName("requests-list-container")[0].innerHTML = text;
        }
    })
};
let Filtered = [];
function filter_ques(val) {
    Filtered.push(val);
    aUpdateSub(document.getElementById("SearchTextValue").value);
}
function replace_history(url) {
    window.location.replace(url);
    window.reload();
}