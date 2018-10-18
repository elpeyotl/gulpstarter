/*********
 * Opens closes dropdown
 */
Vue.component("dropdown-content", {
  props: {
    title: String,
    lastItem: Boolean
  },
  data: function() {
    return {
      showContent: false,
      isLastItem: this.lastItem
    };
  },
  props: ["title", "lastItem"],
  template: `
  <div ref="dropdown">
    <li class="question-box__list-item" :class="{'question-box__list-item--last' : isLastItem && !showContent, 'question-box__list-item--open': showContent }" @click="showContent = !showContent">{{title}}</li>
    <transition name="fade-in">
    <div class="question-box__content" :class="{'question-box__content--last' : isLastItem}" v-show="showContent">
       <slot></slot>
    </div>
    </transition>
  </div>`,
  methods: {
    documentClick: function(e) {
      let el = this.$refs.dropdown;
      let target = e.target;
      if (el !== target && !el.contains(target)) {
        this.showContent = false;
      }
    }
  },
  created() {
    document.addEventListener("click", this.documentClick);
  },
  destroyed() {
    // important to clean up!!
    document.removeEventListener("click", this.documentClick);
  }
});

/*********
 * Opens closes dropdown
 */
Vue.component("lang-switcher", {
  props: {
    title: String
  },
  data: function() {
    return {
      dropdownIsOpen: false,
      selected: "DE",
      selection: ["DE", "FR", "EN"]
    };
  },
  methods: {
    onSelect: function(selection) {
      this.selected = selection;
      this.dropdownIsOpen = false;
    }
  },
  template: `
  <div class="lang-switcher-component">
    <div class="lang-switcher__selected" @click="dropdownIsOpen = !dropdownIsOpen">{{selected}}
        <img class="lang-switcher__arrow" src="assets/images/icon-arrow-down.svg" />
    </div>
    <transition name="fade">
        <div v-show="dropdownIsOpen" class="lang-switcher__dropdown">
            <ul class="lang-switcher__list">
                <li @click="onSelect(sel)" v-for="sel in selection" :key="sel" class="lang-switcher__list-item" :class="{'lang-switcher__list-item--selected': sel === selected}">{{sel}}</li>
            </ul>
        </div>
    </transition>
 </div>`
});

var app = new Vue({
  el: "#app",
  data: {
    showMenu: false,
    mobileMenuOpen: false,
    subPage: true,
    subList: false,
    scrolled: false,
    subNavElements: {
      versicherungen: true,
      mehrwert: false,
      ueberuns: false
    },
    subChildOpen: false,
    dropdownIsOpen: false
  },
  computed: {
    menuIsOpen: function() {
      return this.showMenu ? true : false;
    }
  },
  methods: {
    showSubNav: function(el) {
      this.showMenu = true;
      const navItems = document.querySelectorAll(".main-header__nav-item");
      for (let index = 0; index < navItems.length; index++) {
        const element = navItems[index];
        if (element.classList.contains("main-header__nav--hover-active"))
          element.classList.remove("main-header__nav--hover-active");
      }

      //add active class to element
      el.originalTarget.classList.add("main-header__nav--hover-active");

      const navId = el.originalTarget.dataset.nav;
      const subNavs = document.querySelectorAll(".main-header__sub-nav");
      var subNav = null;

      for (let index = 0; index < subNavs.length; index++) {
        const element = subNavs[index];
        //hide all subnavs
        if (element.classList.contains("show")) {
          element.classList.add("hide");
          element.classList.remove("show");
        }
        if (element.dataset.navSub === navId) subNav = element;
      }
      if (subNav != null) {
        subNav.classList.remove("hide");
        subNav.classList.add("show");
      }
    },
    hideNav: function(el) {
      this.showMenu = false;
      //add active class to element
      el.originalTarget.classList.remove("main-header__nav--hover-active");

      const subNavs = document.querySelectorAll(".main-header__sub-nav");
      for (let index = 0; index < subNavs.length; index++) {
        const element = subNavs[index];
        //hide all subnavs
        if (element.classList.contains("show")) {
          element.classList.add("hide");
          element.classList.remove("show");
        }
      }
    },
    showMobileSubNav: function(element) {
      this.subNavElements[element] = true;
      this.subPage = true;
    },
    mobileSubNavFirstPage: function() {
      //reset subnavelements
      for (var prop in this.subNavElements) {
        this.subNavElements[prop] = false;
      }
      this.subPage = false;
    },
    toggleSublist: function(element) {
      if (element.srcElement.classList.contains("list-item__plus")) {
        console.log(1);
        element.srcElement.classList.remove("list-item__plus");
        element.srcElement.classList.add("list-item__close");
        element.srcElement.nextElementSibling.classList.remove("display-none");
      } else {
        element.srcElement.classList.add("list-item__plus");
        element.srcElement.classList.remove("list-item__close");
        element.srcElement.nextElementSibling.classList.add("display-none");
      }
    }
  },
  mounted: function() {
    const self = this;
    document.addEventListener("scroll", function(event) {
      console.log(event.pageY);
      event.pageY > 116 ? (self.scrolled = true) : (self.scrolled = false);
    });
  }
});
