// HELPER APIS
function get(URI) {
    return fetch(URI).then(response=>response.json())
}

//CONSTANTS
const NEWSAPI_TOP_HEADLINES_BASE_URL = 'https://newsapi.org/v2/top-headlines?'
const PRE_COUNTRY = 'country'
// let COUNTRY = '=us&'
let COUNTRY = 'en'
const PRE_LANGUAGE = 'language'
// let LANGUAGE = '=en&'
let LANGUAGE = 'en'
const PRE_CATEGORY = 'category'
let CATEGORY = 'business'
const API_KEY = 'apiKey=37bff3af9fc5423b9c937c1f524a1c80'
//TODO: Remove the key or do something
const MAIN_ARTICLE_UL = document.querySelector('.articles')
const IMAGE_DIV = document.querySelector('.image')
const SOURCE_DIV = document.querySelector('.source-link')
const BATCH_SIZE = 5
let CURRENT_PAGE = 1
const TEXT_DIV = document.querySelector('.text')

const SHOW_MORE_HEADLINES_BUTTON = document.querySelector('.more-btn')
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

//FUNCTIONS
function getTheHeadlines_INITIAL(){
    TEXT_DIV.innerHTML = ''
    let urlToGetFrom = `${NEWSAPI_TOP_HEADLINES_BASE_URL}`+
    `${PRE_COUNTRY}${COUNTRY}`+
    `${PRE_LANGUAGE}${LANGUAGE}`+
    `${PRE_CATEGORY}${CATEGORY}`+
    `${API_KEY}`
    console.log(urlToGetFrom)
    get(urlToGetFrom).then(getAllTheHeadlinesThenKeepInSomeVariableAndThenRender)
}

function getAllTheHeadlinesThenKeepInSomeVariableAndThenRender(initialArticlesObjectWithEverything){
    allObjectsToPassAroundLater = Object.assign({}, initialArticlesObjectWithEverything)
    CURRENT_PAGE = 1
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
    }

function initiateOrUpdateTicker(){
    tempElement = []
    // allObjectsToPassAroundLater.articles.slice(sliceLowerLimiit,sliceUpperLimit).forEach((item)=>{
    allObjectsToPassAroundLater.articles.forEach((item)=>{
        tempElement.push('<<<')
        tempElement.push(item.title.split(' '))
    })
    let testN = CURRENT_PAGE * 20
    showTickerCoreFunction = setInterval(function(){
        allParts = tempElement.flat().slice(testN,testN+20).reduce((sum,element)=>sum+element+' ')
        TICKER_ELEMENT.innerText = `${allParts.slice(0,130)}`
        if (testN > (tempElement.flat().length-100)){testN = 1} else {testN++}
    },600);
}

function showOneOfTheNewsOnThePage(article){
    let oneArticleDiv = document.createElement('div')
    let title = document.createElement('h2')
    title.innerText = article.title
    title.addEventListener('click',()=>populateDetailsForThisArticle(article))
    let sourceName = document.createElement('h4')
    sourceName.innerText = article.source.name
    oneArticleDiv.append(sourceName,title)
    MAIN_ARTICLE_UL.appendChild(oneArticleDiv)      
}

function populateDetailsForThisArticle(article){
    let detailsP = document.createElement('h4')
    detailsP.innerText = article.content
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
    submitButton.innerText = "Submit selections"
    newLanguageAndCountrySelectionForm.append(selectLanguageFieldName, selectLanguage, selectCountryFieldName,selectCountry,newDivForCategoryOptions,newBreak, submitButton)
    newLanguageAndCountrySelectionForm.addEventListener("submit",initialHeadlinesLoadBasedOnTheLanguageAndCountrySelections)
    LANGUAGE_AND_COUNTRY_SELECTOR_FORM_PARENT_DIV.appendChild(newLanguageAndCountrySelectionForm)
}

function initialHeadlinesLoadBasedOnTheLanguageAndCountrySelections(){
    event.preventDefault()
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
    // newLanguageAndCountrySelectionForm.hidden = true
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

//INITIAL LOADERS, UNRELATED EVENT LISTENERS

document.body.onload = startupActions
SHOW_MORE_HEADLINES_BUTTON.addEventListener('click',decideIfAnotherFetchIsNeededOrKeepUsingThePreviousFetchedArticles)
