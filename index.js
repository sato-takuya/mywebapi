//expressモジュールを読み込み、使えるようにする
const express = require('express')
//ブラウザからのデータを解釈するモジュール
const multer = require('multer')
//ユニークuidを生成するモジュール
const uuidv4 = require('uuid/v4')

//expressアプリケーションを生成
const app = express()
//expressアプリケーションにmulterを適用する(.noneは、ファイルのアップロードなしを意味する)
app.use(multer().none())
// webフォルダの中身を公開する
app.use(express.static('web'))

const todoList = []

//指定したパスにアクセスすると、Todoリストを返す、というAPI
app.get('/api/v1/list',(req,res)=>{
  //JSONデータを返す(ひとまず空の状態)
  res.json(todoList);
})

//指定したパスにPOSTでデータが送信された時に、TOdoリストを更新する、という　API
app.post('/api/v1/add',(req,res)=>{
  //req.bodyで送られたデータ自体を取得できる(オブジェクト型)
  const todoData = req.body
  const todoTitle = todoData.title

  const id = uuidv4()

  //送られてきたデータから、todo項目を作成
  const todoItem = {
    id,
    title: todoTitle,
    done:false
  }
  todoList.push(todoItem)
  // stringif・・・JSON文字列に変換
  console.log('Add:' + JSON.stringify(todoItem))
  res.json(todoItem)
})

// 指定したパスにDELETEで送信してきたときに、項目を削除する、というAPI。:idの部分にはIDが入る
app.delete('/api/v1/item/:id',(req,res)=>{
  const index = todoList.findIndex((item)=>item.id===req.params.id);
  if(index>=0){
    //項目を削除
    const deleted = todoList.splice(index,1)
    console.log('Delete:' + JSON.stringify(deleted[0]))
  }
  res.sendStatus(200)
})

app.put('/api/v1/item/:id',(req,res)=>{
  const index = todoList.findIndex((item)=>item.id===req.params.id)
  if (index >= 0) {
    //項目を削除
    const item = todoList[index]
    if(req.body.done){
      item.done=req.body.done==='true'
    }
    console.log('Edit: ' + JSON.stringify(item));
  }
  res.sendStatus(200)
})

//サーバーを立てる
app.listen(3000, () => console.log('Listening on port 3000'))