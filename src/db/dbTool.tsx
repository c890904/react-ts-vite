import Dexie from 'dexie';
 
// IndexedDB の初期化
const db = new Dexie('ledger');

db.version(1).stores({
  category: '++id, name, type, parent, value',
});

export function initDB() {
    db.table("category").put({id:1, name:"収入", type:0, parent:null, value:1})
    db.table("category").put({id:2, name:"支出", type:0, parent:null, value:-1})
    db.table("category").put({id:3, name:"食費", type:1, parent:2, value:-1})
    db.table("category").put({id:4, name:"食材", type:2, parent:3, value:-1})
    db.table("category").put({id:5, name:"朝食", type:2, parent:3, value:-1})
    db.table("category").put({id:6, name:"昼食", type:2, parent:3, value:-1})
    db.table("category").put({id:7, name:"夕食", type:2, parent:3, value:-1})
}

export interface categoryModel{
  id: number,
  name: string,
  type: number,
  parent: number,
  value: number,
  kids: categoryModel[],
}

export async function getCategory() {
  let got = (await db.table("category").orderBy("type").reverse().toArray()) as categoryModel[];

  let now = got[0].type
  let kidsMap = new Map<number, categoryModel[]>();
  let nowMap = new Map<number, categoryModel[]>();
  let result = [] as categoryModel[]
  got.forEach(data => {
    console.log(now + "  " + data.type)
    if (data.type < now) {
      console.log(data.name + "make new")
      now = data.type
      kidsMap = nowMap
      nowMap = new Map<number, categoryModel[]>();
    }

    let kids = kidsMap.get(data.id)
    if (kids != null) {
      data.kids = kids
    }

    if (data.type == 0) {
      result.push(data)
    } else {
      console.log(data.name + data.parent)
      var arr = nowMap.get(data.parent)
      if (arr != null) {
        console.log(data.name + " push arr")
        arr.push(data)
        nowMap.set(data.parent, arr)
      } else {
        console.log(data.name + " new arr")
        nowMap.set(data.parent, [data] as categoryModel[])
      }
    }
  });

  return result
}

export async function getCategoryByCategory(type:number) {
  let got = (await db.table("category").orderBy("type").filter(data => {
    let a = data as categoryModel
    return a.type < type
  }).reverse().toArray()) as categoryModel[];

  let now = got[0].type
  let kidsMap = new Map<number, categoryModel[]>();
  let nowMap = new Map<number, categoryModel[]>();
  let result = [] as categoryModel[]
  got.forEach(data => {
    console.log(now + "  " + data.type)
    if (data.type < now) {
      console.log(data.name + "make new")
      now = data.type
      kidsMap = nowMap
      nowMap = new Map<number, categoryModel[]>();
    }

    let kids = kidsMap.get(data.id)
    if (kids != null) {
      data.kids = kids
    }

    if (data.type == 0) {
      result.push(data)
    } else {
      console.log(data.name + data.parent)
      var arr = nowMap.get(data.parent)
      if (arr != null) {
        console.log(data.name + " push arr")
        arr.push(data)
        nowMap.set(data.parent, arr)
      } else {
        console.log(data.name + " new arr")
        nowMap.set(data.parent, [data] as categoryModel[])
      }
    }
  });

  return result
}