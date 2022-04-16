import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// vant组件导入和使用 https://vant-contrib.gitee.io/vant/#/zh-CN/quickstart
import "vant/lib/index.css";

// vant 组件
import {
  PullRefresh,
  List,
  Popup,
  Grid,
  GridItem,
  AddressEdit,
  AddressList,
  Icon,
  SubmitBar,
  CheckboxGroup,
  SwipeCell,
  Stepper,
  Checkbox,
  Field,
  Form,
  Tag,
  Button,
  Image as VanImage,
  Card,
  Tab,
  Tabs,
  Swipe,
  SwipeItem,
  Lazyload,
  Badge,
  Sidebar,
  SidebarItem,
  Collapse,
  CollapseItem,
  Empty,
  Divider,
  Uploader,
  Cell,
  CellGroup,
  NavBar,
  Search,
  Tabbar,
  TabbarItem,
  ContactCard,
  Area,
} from "vant";

const vm = createApp(App)
  .use(Swipe)
  .use(SwipeItem)
  .use(Lazyload, {
    lazyComponent: true,
    loading: require("assets/logo.png"),
  })
  .use(Badge)
  .use(Sidebar)
  .use(SidebarItem)
  .use(Collapse)
  .use(CollapseItem)
  .use(Tab)
  .use(Tabs)
  .use(Card)
  .use(VanImage)
  .use(Tag)
  .use(Button)
  .use(Form)
  .use(Field)
  .use(Checkbox)
  .use(Stepper)
  .use(SwipeCell)
  .use(CheckboxGroup)
  .use(SubmitBar)
  .use(Icon)
  .use(AddressList)
  .use(AddressEdit)
  .use(GridItem)
  .use(Grid)
  .use(Popup)
  .use(List)
  .use(PullRefresh)
  .use(Empty)
  .use(Divider)
  .use(Uploader)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Search)
  .use(Tabbar)
  .use(TabbarItem)
  .use(ContactCard)
  .use(Area)
  .use(store)
  .use(router)
  .mount("#app");
