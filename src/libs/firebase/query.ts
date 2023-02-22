import { Database, equalTo, get, orderByChild, push, query, ref, update } from "firebase/database"

export async function pushByRefDB( //using
  db: Database,
  path: string,
  content: unknown,
) {
  const updates: any = {}
  const key = push(ref(db, path)).key
  updates[path+ "/" +key] = content
  update(ref(db), updates)
}

export async function updateByQueryDB( // using
  db: Database,
  root: string,
  child: string,
  equal: string | number | boolean | null,
  target: string,
  content: unknown,
) {
  const query_ = query(ref(db, root), orderByChild(child), equalTo(equal))
  const snapshot = await get(query_)
  const contents = snapshot.val()
  if (!contents) {
    console.log(`not match ${root}, ${child}=${equal}`)
    // pushByRefDB(db, root, content)
    return false
  }
  const updates: any = {}
  for (let i in contents) {
    updates[root+"/" +i+ "/"+target] = content
  }
  update(ref(db), updates)
  return true
}