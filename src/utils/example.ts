export const scriptExamples = [
    {
        id:1,
        name:'基础操作',
        preCase:[],
        script:`const homePage = "https://4399.com" // 定义变量
await page.create(homePage) // 使用变量打开页面
await sleep(1000) // 固定等待
await page.to('https://baidu.com') // 切换页面
await assert.custom("#su","value","百度一下",0) // 页面元素断言
await assert.location("https://www.baidu.com/") // 页面地址断言
await assert.title("百度一下，你就知道") // 页面title 断言
// 执行hover
await dom.hover('#s-top-left > div > a') // hover 元素
await dom.click('#kw') // 元素点击
if (await dom.exist('#kw')){ // 根据元素是否存在，接入逻辑分支
    console.log("元素#kw存在") 
}else{
    console.log("元素不存在")
    throw new Error("因为元素未找到,主动结束执行!") // 主动抛出错误
}

const roundNum = Math.round(Math.random()*1000) // 随机获取1-1000 之间的数
const name = "名称" +  roundNum // 字符串组合

await dom.fill('#kw',name) // input 输入文本
await sleep(2000)

await dom.click('#su')
await page.screenshot("test-1.jpg") // 屏幕截图
await sleep(1000)

await page.to('https://element.eleme.cn/#/zh-CN/component/upload', {waitUntil:'commit'}) // 页面跳转
// 跨平台截图,node 模块引用
var path = require('path')
var os = require('os')
var imgPath = path.resolve(os.tmpdir(),'nihao.jpg') // 获取跨平台的临时目录
await page.screenshot(imgPath)
// 截图上传
await dom.upload('#app > div.main-cnt > div > div.el-scrollbar__wrap > div > div > div.page-component__content > section > div:nth-child(4) > div.source > div > div > div.el-upload.el-upload--text > input','https://www.jd.com/favicon.ico')
await sleep(1000)
        `
    },
    {
        id:2,
        name:'h5页面执行',
        preCase:[],
        script:`await page.setDevice("iPhone 6")
await page.to("https://baidu.com")
await dom.click("label")
await dom.fill('[placeholder="输入搜索词"]',"京东")
await Promise.all([
dom.click("#index-bn"),
    page.waitForEvent('framenavigated')
]);
console.log('进入了京东')

await Promise.all([
    dom.click(".ec-comp_d20_text_title-text > .c-title"),
    page.waitForEvent('load')
])

await assert.title("多快好省")
        `
    },
    {
        id:3,
        name:'页面对象封装',
        preCase:[],
        script:`// 注意: 仅存放全局变量,无需运行
// https://element.eleme.cn/#/zh-CN/component/form
const nameSign = '(//label[text()="活动名称"]/following-sibling::div//input)[1]'
const name = "活动名称"
// 可以使用中文变量增加可读性
const 活动区域Sign = '(//label[text()="活动区域"]/following-sibling::div//input)[1]'
const 活动区域item = '(//span[text()="区域一"])[4]'
// 将切换开关进行函数封装
const switchOpen = async ()=>{
    await dom.click(".el-switch__core >> nth=0")
}
// 也可以使用对象维护
const fromPage = {
    activitydate:{
        date:{
            sign:'(//input[@placeholder="选择日期"])[1]',
            value:'2022-05-19'
        },
        time:{
            sign:'(//input[@placeholder="选择时间"])[1]',
            value:"20:05:04"
        },
        活动形式:{
            sign:'(//label[text()="活动形式"]/following-sibling::div//textarea)[1]',
            value:'自由活动'
        }
    }
}
        `
    },
    {
        id:4,
        name:'基于页面对象进行流程测试',
        preCase:[3],
        script:`// 依赖-页面对象封装
await page.to("https://element.eleme.cn/#/zh-CN/component/form",{waitUntil:'commit'})
await dom.click(nameSign)
await dom.fill(nameSign,name)
await dom.click(活动区域Sign)
await dom.click(活动区域item)
await dom.fill(fromPage.activitydate.date.sign,fromPage.activitydate.date.value)
await keyboard.press('Enter',{delay:600})
await dom.fill(fromPage.activitydate.time.sign,fromPage.activitydate.time.value)
await keyboard.press('Enter',{delay:600})
await switchOpen()
await dom.click("label:nth-child(2) .el-checkbox__input >> nth=0")
await dom.click("label:nth-child(2) .el-radio__input .el-radio__inner >> nth=0")
await dom.fill(fromPage.activitydate.活动形式.sign,fromPage.activitydate.活动形式.value)
await sleep(2000)
        `
    },
    {
        id:5,
        name:'cookie跳过登陆认证',
        preCase:[],
        script:`await cookies.set([{
    "domain": ".jd.com",
    "name": "cherry",
    "path": "/",
    "value": "jZ0bGJpeXR3Z1FCeWRPclJ1LTRtOUI22kpXfmxKSDU1Sk5LS3htS3dDS3RoRUFBQUFBJ",
}])
// 登陆后操作
          `
    },
    {
        id:6,
        name:'接口数据hook验证',
        preCase:[],
        script:`// 禁止页面内图片加载
await browser.route('**/*.{png,jpg,jpeg}', route => route.abort());
await browser.route('/user/loginuser.json', route => {
    // 修改接口返回内容
    route.fulfill({ body: 'mocked-data' });
});

await page.to('http://t.268xue.com/')
await sleep(3000)
        `
    },
    {
        id:7,
        name:'多页面交替测试',
        preCase:[],
        script:`// 首个page.to将自动切换为create
await page.to('https://jxi-fuli.jd.com/login.html')
await page.create('https://baidu.com')
await page.create('http://4399.com')

await sleep(2000)
await page.change(0)

await sleep(2000)
await page.change("4399")

await sleep(2000)
await page.change('baidu.com')
// 夹杂页面操作
await dom.fill("#kw",'京东')

await sleep(2000)
await page.change('/login.html')

await sleep(2000)
        `
    },
    // {
    //     id:8,
    //     name:'按键，鼠标操作模拟',
    //     preCase:[],
    //     script:`await cookies.set([{
    //         "domain": ".jd.com",
    //         "name": "cherry",
    //         "path": "/",
    //         "value": "jZ0bGJpeXR3Z1FCeWRPclJ1LTRtOUI22kpXfmxKSDU1Sk5LS3htS3dDS3RoRUFBQUFBJ",
    //       }])
    //       // 登陆后操作`
    // }
]