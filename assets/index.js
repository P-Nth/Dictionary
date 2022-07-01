class SearchWord {
  constructor() {
    this.args = {
      wrapper: document.querySelector(".wrapper"),
      searchInput: document.querySelector("input"),
      removeIcon: document.querySelector(".search span"),
      infoText: document.querySelector(".info-text"),
    };

    this.returned = [];
  }
  searchWord() {
    const { wrapper, searchInput, removeIcon, infoText } = this.args;
    removeIcon.addEventListener("click", () => {
      this.clearInput(searchInput, wrapper, infoText);
    });

    searchInput.addEventListener("keyup", ({ key }) => {
      let num = 0;
      if (key === "Enter") {
        this.submitWord(wrapper, searchInput, infoText);
        num++;
      }
      console.log(num);
      if (num > 0) {
        this.submitWord(wrapper, searchInput, infoText);
      }
    });
  }

  clearInput(searchInput, wrapper, infoText) {
    searchInput.value = "";
    wrapper.classList.remove("active");
    infoText.innerHTML = `Type any existing word and press enter to get meaning, example, synonyms, etc.`;
  }
  // fetch data function
  submitWord(wrapper, searchInput, infoText) {
    if (searchInput.value === "") {
      wrapper.classList.remove("active");
      infoText.innerHTML = `Type any existing word and press enter to get meaning, example,
      synonyms, etc.`;
      return;
    }
    infoText.innerHTML = `Searching the meaning of <span>"${searchInput.value}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchInput.value}`;
    fetch(url)
      .then((res) => res.json())
      .then((r) => {
        let searchedWord = searchInput.value;
        let answer = { r, searchedWord };
        this.returned = answer;
        searchInput.value = `${searchedWord}`;
        this.postData(wrapper);
        this.openWrapper(wrapper);
      })
      .catch((error) => {
        console.log("Error:", error);
        infoText.innerHTML = `Word ${searchInput.value} is not found! Please search another word!`;
        this.closeWrapper(wrapper, searchInput);
      });
  }

  postData(wrapper) {
    let phonetic = wrapper.querySelector(".word p");
    let speech = wrapper.querySelector(".word span");
    let volume = document.querySelector(".word i");
    let meaning = wrapper.querySelector(".meaning span");
    let example = wrapper.querySelector(".example span");
    let synonyms = wrapper.querySelector(".synonym .list");
    function random(num) {
      return Math.floor(Math.random() * num);
    }
    console.log(this.returned);
    let a = random(this.returned.r[0].meanings[0].definitions.length);
    let b = this.returned.r[0].meanings[0].synonyms.length;
    let c = this.returned.r[0].meanings[0].definitions[a].example;
    let d = this.returned.r[0].meanings[0].synonyms;
    let e = random(this.returned.r[0].meanings[0].synonyms.length);
    let synonym = "";
    if (a !== undefined) {
      phonetic.innerHTML = this.returned.r[0].word;
      speech.innerHTML = `${this.returned.r[0].meanings[0].partOfSpeech} ${this.returned.r[0].phonetic}`;
      meaning.innerHTML =
        this.returned.r[0].meanings[0].definitions[a].definition;
      if (c !== undefined) {
        example.innerHTML = c;
      } else {
        example.innerHTML = "No example available!";
      }
      if (d[e] !== undefined) {
        d.slice().forEach((element) => {
          for (let i = 0; i < b; i++) {
            synonym = `<span>${element}</span>`;
          }
          synonyms.innerHTML += synonym;
        });
      } else {
        synonym = `<span>This word has no synonym</span>`;
        synonyms.innerHTML += synonym;
      }
    }
  }

  openWrapper(wrapper) {
    setTimeout(() => {
      wrapper.classList.add("active");
    }, "500");
  }

  closeWrapper(wrapper) {
    setTimeout(() => {
      wrapper.classList.remove("active");
    }, "200");
  }
}

const newFedData = new SearchWord();
newFedData.searchWord();
