// HELPER APIS
function get(URI) {
    return fetch(URI).then(response=>response.json())
}

function post(URI,newObj){
    let configObj = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(newObj)
      };
    return fetch(URI, configObj).then(response=>response.json())
}

function patch(URI,id,patchObj){
    let patchData = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        body: JSON.stringify(patchObj)
        };
        return fetch(`${URI}${id}`,patchData).then(response=>response.json())
}

//CONSTANTS
const NEWSAPI_TOP_HEADLINES_BASE_URL = 'https://newsapi.org/v2/top-headlines?'
const PRE_COUNTRY = 'country'
let COUNTRY = 'en'
const PRE_LANGUAGE = 'language'
let LANGUAGE = 'en'
const PRE_CATEGORY = 'category'
let CATEGORY = 'business'
const PRE_PAGE = 'page'
let API_PAGE_INDICATOR = 1
let MAX_API_PAGE_INDICATOR = 1
const API_KEY = 'apiKey=37bff3af9fc5423b9c937c1f524a1c80'
//TODO: Remove the key or do something
const MAIN_ARTICLE_UL = document.querySelector('.articles')
const IMAGE_DIV = document.querySelector('.image')
const SOURCE_DIV = document.querySelector('.source-link')
const BATCH_SIZE = 5
let CURRENT_PAGE = 1
const TEXT_DIV = document.querySelector('.text')
const SHOW_MORE_HEADLINES_BUTTON = document.getElementById('id-more-button')
let allObjectsToPassAroundLater = {}
const LANGUAGE_AND_COUNTRY_SELECTOR_FORM_PARENT_DIV = document.getElementById('language-and-country-selector-parent-div')
const LANGUAGE_OPTIONS_ARRAY = ["en","tr","ar",'pt','ru']
const COUNTRY_OPTIONS_ARRAY = ["us","tr",'ae','de','pt','ru']
const CATEGORIES_ARRAY = ['business','entertainment','general','health','science','sports','technology']
let selectedCategories = []
const newLanguageAndCountrySelectionForm = document.createElement('form')
const TICKER_ELEMENT = document.getElementById('ticker-content')
let tempElement = []
let showTickerCoreFunction = null
let thisIsInitialOneOnThePage = true
let LOGGED_IN_USER =''
let IS_USER_LOGGED_IN = false
const NEW_USER_FORM = document.getElementById('new-user-form')
const NEW_USER_NAME = document.getElementById('new-user-name')
const NEW_USER_PASSWORD = document.getElementById('new-user-password')
const NEW_USER_PASSWORD_CONFIRMATION = document.getElementById('new-user-password-confirmation')
const LOGIN_USER_FORM = document.getElementById('user-login-form')
const LOGIN_USER_NAME = document.getElementById('login-user-name')
const LOGIN_USER_PASSWORD = document.getElementById('login-user-password')
const BASE_URL_USERS = 'http://127.0.0.1:3000/users/'
const BASE_URL_USER_SESSIONS = 'http://127.0.0.1:3000/user_sessions'
const initiatorSignupButton = document.getElementById('initiatorSignupButton')
const initiatorLoginButton = document.getElementById('initiatorLoginButton')
const initiatorLogoutButton = document.getElementById('initiatorLogoutButton')
let LOGGED_IN_USER_DETAILS_DIV = document.getElementById('logged-in-user-details')

//FUNCTIONS
function getTheHeadlines_INITIAL(){
    TEXT_DIV.innerHTML = ''
    PAGE = `=${API_PAGE_INDICATOR}&`
    let urlToGetFrom = `${NEWSAPI_TOP_HEADLINES_BASE_URL}`+
    `${PRE_COUNTRY}${COUNTRY}`+
    `${PRE_LANGUAGE}${LANGUAGE}`+
    `${PRE_CATEGORY}${CATEGORY}`+
    `${PRE_PAGE}${PAGE}` +
    `${API_KEY}`
    get(urlToGetFrom).then(getAllTheHeadlinesThenKeepInSomeVariableAndThenRender)
}

function getAllTheHeadlinesThenKeepInSomeVariableAndThenRender(initialArticlesObjectWithEverything){
    allObjectsToPassAroundLater = Object.assign({}, initialArticlesObjectWithEverything)
    CURRENT_PAGE = 1
    MAX_API_PAGE_INDICATOR = parseInt(allObjectsToPassAroundLater.totalResults/20)
    if (API_PAGE_INDICATOR < MAX_API_PAGE_INDICATOR) {
        API_PAGE_INDICATOR++
    } else {
        API_PAGE_INDICATOR=1
    }
    renderPageForTheBatchSize(allObjectsToPassAroundLater)
}

function renderPageForTheBatchSize(allObjectsToPassAroundLater) {
    let sliceLowerLimiit = (CURRENT_PAGE-1)*BATCH_SIZE
    let sliceUpperLimit = (CURRENT_PAGE)*BATCH_SIZE
    MAIN_ARTICLE_UL.innerHTML = ''
    if (showTickerCoreFunction != null){clearInterval(showTickerCoreFunction)}
    initiateOrUpdateTicker()
    allObjectsToPassAroundLater.articles.slice(sliceLowerLimiit,sliceUpperLimit).forEach(showOneOfTheNewsOnThePage)
    populateDetailsForThisArticle(allObjectsToPassAroundLater.articles.slice(sliceLowerLimiit,sliceUpperLimit)[0])
    CURRENT_PAGE +=1
    SHOW_MORE_HEADLINES_BUTTON.style.visibility = "visible"
    }

function initiateOrUpdateTicker(){
    tempElement = []
    allObjectsToPassAroundLater.articles.forEach((item)=>{
        tempElement.push('<<<')
        tempElement.push(item.title.split(' '))
    })
    let tickerScale = CURRENT_PAGE * 20
    showTickerCoreFunction = setInterval(function(){
        allParts = tempElement.flat().slice(tickerScale,tickerScale+20).reduce((sum,element)=>sum+element+' ')
        TICKER_ELEMENT.innerText = `${allParts.slice(0,250)}`
        if (tickerScale > (tempElement.flat().length-100)){tickerScale = 1} else {tickerScale++}
    },500);
}

function showOneOfTheNewsOnThePage(article){
    let oneArticleDiv = document.createElement('div')
    oneArticleDiv.classList.add('oneArticleDiv')
    let title = document.createElement('h2')
    title.innerText = article.title
    title.style.cursor = "pointer"
    title.addEventListener('click',()=>populateDetailsForThisArticle(article))
    let sourceName = document.createElement('h4')
    sourceName.classList.add('source-name')
    sourceName.innerText = article.source.name
    let saveForLaterButton = document.createElement('button')
    saveForLaterButton.classList.add('saveForLaterButton')
    saveForLaterButton.style.border = 'none'
    saveForLaterButton.style.backgroundColor = "rgb(240, 239, 239)"
    saveForLaterButton.innerText = "Save for Later"
    saveForLaterButton.style.cursor = "pointer"
    saveForLaterButton.hidden = !IS_USER_LOGGED_IN
    saveForLaterButton.addEventListener("click",()=>saveForLaterButtonAction(article,saveForLaterButton,divSourceNameAndSaveForLaterButton))
    let divSourceNameAndSaveForLaterButton = document.createElement('div')
    divSourceNameAndSaveForLaterButton.append(sourceName,saveForLaterButton)
    divSourceNameAndSaveForLaterButton.classList.add('divSourceNameAndSaveForLaterButton')
    MAIN_ARTICLE_UL.appendChild(divSourceNameAndSaveForLaterButton)
    oneArticleDiv.appendChild(title)
    MAIN_ARTICLE_UL.appendChild(oneArticleDiv)      
}

function saveForLaterButtonAction(article,saveForLaterButton,divSourceNameAndSaveForLaterButton){
        let patchObject = {
            add_to_saveforlater: article
        }
        patch(BASE_URL_USERS,LOGGED_IN_USER.id,patchObject).then((event)=>
        saveForLaterButton.remove())
        let checkMark = document.createElement('img')
        checkMark.src = './images/tick.svg'
        checkMark.classList.add('checkMark')
        divSourceNameAndSaveForLaterButton.appendChild(checkMark)
}

function populateDetailsForThisArticle(article){
    let detailsP = document.createElement('h4')
    detailsP.innerText = article.content
    detailsP.style.fontSize = "x-large"
    TEXT_DIV.innerHTML = ''
    TEXT_DIV.appendChild(detailsP)
    let image = document.createElement('img')
    image.src = article.urlToImage
    image.classList.add('the-image-class')
    IMAGE_DIV.innerHTML = ''
    IMAGE_DIV.appendChild(image)
    let urlForTheSource = document.createElement('a')
    urlForTheSource.innerText = 'Go to Source'
    urlForTheSource.href = article.url
    urlForTheSource.target = '_blank'
    SOURCE_DIV.innerHTML=''
    SOURCE_DIV.appendChild(urlForTheSource)
}

function createFormToGetTheLanguaageAndCountrySelection(){
    let selectLanguageFieldName = document.createElement('p')
    selectLanguageFieldName.innerText = 'Select language'
    let selectLanguage = document.createElement('select')
    selectLanguage.id = 'select-language'
    LANGUAGE_OPTIONS_ARRAY.forEach(element=>{
        let newOption = document.createElement('option')
        newOption.innerText = element
        selectLanguage.appendChild(newOption)
    })
    let selectCountryFieldName = document.createElement('p')
    selectCountryFieldName.innerText = 'Select country'
    let selectCountry = document.createElement('select')
    selectCountry.id = 'select-country'
    COUNTRY_OPTIONS_ARRAY.forEach(element=>{
        let newOption = document.createElement('option')
        newOption.innerText = element
        selectCountry.appendChild(newOption)
    })
    let submitButton = document.createElement('button')
    let newBreak = document.createElement('br')
    let newDivForCategoryOptions = document.createElement('div')
    newDivForCategoryOptions.id = 'category-selection-div'
    CATEGORIES_ARRAY.forEach(element=>{
        let newInput = document.createElement('input')
        newInput.type='radio'
        newInput.id = element
        newInput.name = 'category'
        newInput.value = element
        newInput.classList.add('category')
        let newLabel = document.createElement('label')
        newLabel.for = element
        newLabel.innerText = element
        newDivForCategoryOptions.append(newInput,newLabel)
    })
    let newSpanForSubmitButton = document.createElement('span')
    newSpanForSubmitButton.innerText = "Submit selections"
    submitButton.classList.add('submit-selection-btn')
    submitButton.appendChild(newSpanForSubmitButton)
    newLanguageAndCountrySelectionForm.append(selectLanguageFieldName, selectLanguage, selectCountryFieldName,selectCountry,newDivForCategoryOptions,submitButton)
    newLanguageAndCountrySelectionForm.addEventListener("submit",initialHeadlinesLoadBasedOnTheLanguageAndCountrySelections)
    LANGUAGE_AND_COUNTRY_SELECTOR_FORM_PARENT_DIV.appendChild(newLanguageAndCountrySelectionForm)
}

function initialHeadlinesLoadBasedOnTheLanguageAndCountrySelections(){
    event.preventDefault()
    API_PAGE_INDICATOR =1 
    let LANGUAGE_SELECTION = document.getElementById('select-language')
    LANGUAGE = `=${LANGUAGE_SELECTION.value}&`
    let COUNTRY_SELECTION = document.getElementById('select-country')
    COUNTRY = `=${COUNTRY_SELECTION.value}&`
    let allCategoryRadioButtons = document.querySelectorAll('.category')
    allCategoryRadioButtons.forEach(item=>{
        if (item.checked){
            selectedCategories.push(item.id)
        }
    })
    CATEGORY = `=${selectedCategories[0]}&`
    selectedCategories =[]
    getTheHeadlines_INITIAL()
}

function startupActions(){
    createFormToGetTheLanguaageAndCountrySelection()
}

function decideIfAnotherFetchIsNeededOrKeepUsingThePreviousFetchedArticles(){
    if (CURRENT_PAGE*BATCH_SIZE > 20) {
        thisIsInitialOneOnThePage = true
        getTheHeadlines_INITIAL()
    } else {
        thisIsInitialOneOnThePage = true
        renderPageForTheBatchSize(allObjectsToPassAroundLater)
    }
}

function initiateUserRegistration(){
    event.preventDefault()
    let newUserDetails ={
        username: NEW_USER_NAME.value,
        password: NEW_USER_PASSWORD.value,
        password_confirmation: NEW_USER_PASSWORD_CONFIRMATION.value
    }
    let newUserObject = {
        user: newUserDetails
    }
    post(BASE_URL_USERS,newUserObject).then((user)=>successfulUserLoginActions(user))
}

function initiateUserLogin (){
    event.preventDefault()
    let loginUserDetails = {
        username: LOGIN_USER_NAME.value,
        password: LOGIN_USER_PASSWORD.value
    }
    let loginUserObject = {
        user: loginUserDetails
    }
    post(BASE_URL_USER_SESSIONS,loginUserObject).then((user)=>successfulUserLoginActions(user))
}

function successfulUserLoginActions(user){
    LOGGED_IN_USER = user
    IS_USER_LOGGED_IN = true
    document.querySelectorAll('.saveForLaterButton').forEach((item)=>{
        item.hidden = false
    })
    
    let newH2 = document.createElement('h2')
    newH2.innerText = `Welcome ${LOGGED_IN_USER.username}   `
    LOGGED_IN_USER_DETAILS_DIV.innerHTML = ''
    LOGGED_IN_USER_DETAILS_DIV.appendChild(newH2)
    LOGIN_USER_FORM.style.visibility = "hidden"
    NEW_USER_FORM.style.visibility = "hidden"
    initiatorSignupButton.style.visibility = 'hidden'
    initiatorLoginButton.style.visibility = 'hidden'
    initiatorLogoutButton.style.visibility = "visible"
}

function initiatorLoginButtonActions(){
    initiatorLoginButton.style.visibility = 'hidden'
    LOGIN_USER_FORM.style.visibility = "visible"
}

function initiatorSignupButtonActions(){
    initiatorSignupButton.style.visibility = 'hidden'
    NEW_USER_FORM.style.visibility = "visible"
}

function logoutActions(){
    initiatorLogoutButton.style.visibility = 'hidden'
    initiatorLoginButton.style.visibility = 'visible'
    initiatorSignupButton.style.visibility = 'visible'
    LOGGED_IN_USER = ''
    IS_USER_LOGGED_IN = false
    document.querySelectorAll('.saveForLaterButton').forEach((item)=>{
        item.hidden = true
    })
    document.querySelectorAll('.checkMark').forEach((item)=>{
        item.remove()
    })
    LOGGED_IN_USER_DETAILS_DIV.innerHTML = ''
}

//INITIAL LOADERS, UNRELATED EVENT LISTENERS
document.body.onload = startupActions
NEW_USER_FORM.addEventListener("submit", initiateUserRegistration)
LOGIN_USER_FORM.addEventListener("submit", initiateUserLogin)
SHOW_MORE_HEADLINES_BUTTON.addEventListener('click',decideIfAnotherFetchIsNeededOrKeepUsingThePreviousFetchedArticles)
initiatorLoginButton.addEventListener('click',initiatorLoginButtonActions)
initiatorSignupButton.addEventListener('click',initiatorSignupButtonActions)
initiatorLogoutButton.addEventListener('click',logoutActions)