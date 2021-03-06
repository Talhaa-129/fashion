import axios from "axios";
import { message } from "antd";
import * as actions from "./reducer";
import { call, put, takeLatest } from "redux-saga/effects";

function* drawerVisible({ payload: modalVisible }) {
  yield put(actions.drawer(modalVisible));
}

function* createAccount({ payload }) {
  const { firstname, lastname, email, password, phoneNo } = payload;
  const main = { firstname, lastname, email, password, phoneNo };
  const filee = payload.photo.file.originFileObj;
  const form = new FormData();
  form.append("image", filee);
  form.append("formValues", JSON.stringify(main));
  const head = {
    "Content-Type": "multipart/form-data",
  };
  try {
    const res = yield call(axios.post, "/createAccounttt", form, {
      Headers: head,
    });
    if (res.status === 200) {
      message.success("Create Successfully");
    }
  } catch (e) {
    console.log(e, "Error create Account");
  }
}

function* loginForm({ payload }) {
  const { useremail, password } = payload;
  const data = { useremail, password };
  try {
    const respo = yield call(axios.post, "/login", data);
    const token = respo.data.accessToken;
    localStorage.setItem("token", token);
    yield put({ type: "DATA_BY_ID" });
  } catch (error) {
    console.log(error, "Invalid Error");
  }
}

function* DataWhenLogin() {
  const accessToken = localStorage.getItem("token");
  const tok = { accessToken };
  const token = tok.accessToken;
  const head = {
    Authorization: token,
  };
  try {
    const res = yield call(axios.get, "/getuserdata", { headers: head });
    yield put(actions.loginAccount(res.data));
    const response = res.data;
    if (response.length != 0) {
      yield put({ type: "GET_PRODUCT" });
      yield put({ type: "GET_CASUAL" });
      yield put({ type: "GET_SAREE" });
      yield put({ type: "FETCH_CART" });
      // const res = yield call(axios.get, "/getProducts");
      // const response = yield call(axios.get, "/getCasual");
      // const resSaree = yield call(axios.get, "/getSaree");
      // yield put(actions.Allproducts(res.data));
      // yield put(actions.Casualproducts(response.data));
      // yield put(actions.SareeProducts(resSaree.data));
    } else {
      console.log("User Empty");
    }
  } catch (err) {
    console.log(err, "Error login");
  }
}

function* GetProduct() {
  try {
    const res = yield call(axios.get, "/getProducts");
    yield put(actions.Allproducts(res.data));
  } catch (err) {
    console.log(err, " error getProduct");
  }
}
function* GetCasual() {
  try {
    const response = yield call(axios.get, "/getCasual");
    yield put(actions.Casualproducts(response.data));
  } catch (err) {
    console.log(err, " error getProduct");
  }
}
function* GetSaree() {
  try {
    const resSaree = yield call(axios.get, "/getSaree");
    yield put(actions.SareeProducts(resSaree.data));
  } catch (err) {
    console.log(err, " error getProduct");
  }
}

function* fetchProductId({ payload }) {
  try {
    const { id, type } = payload;
    const Producttype = { id, type };
    const ProductId = yield call(axios.post, "/getProductId", { Producttype });
    if (ProductId.data.length != 0) {
      yield put(actions.ProductById(ProductId.data[0]));
    }
  } catch (err) {
    console.log(err, "error Fetch product By Id");
  }
}

function* AddToCart({ payload }) {
  try {
    const data = { payload };
    const responseCart = yield call(axios.post, "/addToCart", data);
    if (responseCart.data != 0) {
      message.success("Added Cart");
    }
    yield put({ type: "FETCH_CART" });
  } catch (error) {
    console.log(error, "error to add cart");
  }
}

function* fetchCart() {
  try {
    const response = yield call(axios.get, "/fetchCart");
    yield put(actions.AllCart(response.data));
  } catch (err) {
    console.log(err, "error fetch cart");
  }
}

function* increment({ payload }) {
  yield put(actions.Increment(payload));
}
function* decrement({ payload }) {
  yield put(actions.Decrement(payload));
}
function* deletecart({ payload }) {
  try {
    const idd = payload.id;
    const data = { ID: idd };
    yield call(axios.delete, "/deleteCart", { data });
    message.success("Deleted Successfully");
    yield put({ type: "FETCH_CART" });
  } catch (e) {
    console.log(e);
  }
}

function* logout() {
  const data = [[]];
  yield put(actions.loginAccount(data));
}

function* homeSaga() {
  yield takeLatest("VISIBLE", drawerVisible);
  yield takeLatest("CREATE_ACCOUNT", createAccount);
  yield takeLatest("LOGIN_FORM", loginForm);
  yield takeLatest("DATA_BY_ID", DataWhenLogin);
  yield takeLatest("FETCH_PRODUCT_BY_ID", fetchProductId);
  yield takeLatest("LOG_OUT", logout);
  yield takeLatest("GET_PRODUCT", GetProduct);
  yield takeLatest("GET_CASUAL", GetCasual);
  yield takeLatest("GET_SAREE", GetSaree);
  yield takeLatest("ADD_TO_CART", AddToCart);
  yield takeLatest("FETCH_CART", fetchCart);
  yield takeLatest("INCREMENT", increment);
  yield takeLatest("DECREMENT", decrement);
  yield takeLatest("DELETE_CART", deletecart);
}
export default homeSaga;
