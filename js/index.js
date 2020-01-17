// HELPER APIS
function get(URI) {
    return fetch(URI).then(response=>response.json())
}

function destroy(URI,id){
    let configObj = {
        method: "DELETE"
    }
    return fetch(`${URI}/${id}`,configObj).then(response=>response.json())
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
// let COUNTRY = '=us&'
let COUNTRY = ''
const PRE_LANGUAGE = 'language'
// let LANGUAGE = '=en&'
let LANGUAGE = ''
const PRE_CATEGORY = 'category'
let CATEGORY = ''
const API_KEY = 'apiKey=37bff3af9fc5423b9c937c1f524a1c80'
//TODO: Remove the key or do something
const MAIN_ARTICLE_DIV = document.getElementById('main-article-div')
const BATCH_SIZE = 2
let CURRENT_PAGE = 1
const DETAILS_DIV = document.getElementById('details-div')
const SHOW_MORE_HEADLINES_BUTTON = document.getElementById('show-more-headlines-button')
let allObjectsToPassAroundLater = {}
const LANGUAGE_AND_COUNTRY_SELECTOR_FORM_PARENT_DIV = document.getElementById('language-and-country-selector-parent-div')
const LANGUAGE_OPTIONS_ARRAY = ["en","tr","ar"]
const COUNTRY_OPTIONS_ARRAY = ["us","tr",'ae','de']
const CATEGORIES_ARRAY = ['business','entertainment','general','health','science','sports','technology']
let selectedCategories = []
const newLanguageAndCountrySelectionForm = document.createElement('form')

//FUNCTIONS
function getTheHeadlines_INITIAL(){
    DETAILS_DIV.innerHTML = ''
    let urlToGetFrom = `${NEWSAPI_TOP_HEADLINES_BASE_URL}`+
    `${PRE_COUNTRY}${COUNTRY}`+
    `${PRE_LANGUAGE}${LANGUAGE}`+
    `${PRE_CATEGORY}${CATEGORY}`+
    `${API_KEY}`
    get(urlToGetFrom).then(getAllTheHeadlinesThenKeepInSomeVariableAndThenRender)
}

function getAllTheHeadlinesThenKeepInSomeVariableAndThenRender(initialArticlesObjectWithEverything){
    allObjectsToPassAroundLater = Object.assign({}, initialArticlesObjectWithEverything)
    renderPageForTheBatchSize(allObjectsToPassAroundLater)
}

function renderPageForTheBatchSize(allObjectsToPassAroundLater) {
    //TODO: Refactor so that BATCH_SIZE and CURRENT_PAGE are taken into consideration
    let sliceLowerLimiit = (CURRENT_PAGE-1)*BATCH_SIZE
    let sliceUpperLimit = (CURRENT_PAGE)*BATCH_SIZE
    MAIN_ARTICLE_DIV.innerHTML = ''
    allObjectsToPassAroundLater.articles.slice(sliceLowerLimiit,sliceUpperLimit).forEach(showOneOfTheNewsOnThePage)
    CURRENT_PAGE +=1
    }

function showOneOfTheNewsOnThePage(article){
    let oneArticleDiv = document.createElement('div')
    let title = document.createElement('h2')
    title.innerText = article.title
    title.addEventListener('click',()=>populateDetailsForThisArticle(article))
    let urlForTheSource = document.createElement('a')
    urlForTheSource.innerText = 'Go to Source'
    urlForTheSource.href = article.url
    let sourceName = document.createElement('h4')
    sourceName.innerText = article.source.name
    let image = document.createElement('img')
    image.src = article.urlToImage //TODO: Enable this line when we want to show the images
    // image.src = ''
    oneArticleDiv.append(sourceName,title,urlForTheSource,image)
    MAIN_ARTICLE_DIV.appendChild(oneArticleDiv)
}

function populateDetailsForThisArticle(article){
    let detailsP = document.createElement('p')
    detailsP.innerText = article.content
    DETAILS_DIV.innerHTML = ''
    DETAILS_DIV.appendChild(detailsP)
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
    newLanguageAndCountrySelectionForm.hidden = true
    getTheHeadlines_INITIAL()
}

function startupActions(){
    createFormToGetTheLanguaageAndCountrySelection()
}

//INITIAL LOADERS, UNRELATED EVENT LISTENERS

document.body.onload = startupActions
SHOW_MORE_HEADLINES_BUTTON.addEventListener('click',()=>renderPageForTheBatchSize(allObjectsToPassAroundLater))
