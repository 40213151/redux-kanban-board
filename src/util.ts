/**
 * ランダムな ID `[0-9A-Za-z_-]{12}` を作成する
 */
export function randomID() {
  const alphabet =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-'

  let id = ''
  for (let i = 12; i > 0; i--) {
    id += alphabet[(Math.random() * 64) | 0]
  }

  return id
}

 /**
  * リストをリストの順序情報に従ってソートした新しいリストを返す
  *
  * @param list リスト
  * @param order リストの順序情報
  * @param head リストの先頭のキー
  */
 export function sortBy<
  // Exclude<V, null> は、V 型から null を除外した型を示す。
   E extends { id: Exclude<V, null> },
   V extends string | null
   // list: E[]型の配列で、ソートするオブジェクトのリスト
   // order: Record<string, V> 型で、特定の順序を示すオブジェクト。
   //        このオブジェクトのキーは文字列で、値は V 型（string または null）
   // head: V 型から null を除外した型で、ソートの開始点を示すオブジェクトのid。
 >(list: E[], order: Record<string, V>, head: Exclude<V, null>) {
  // reduce関数は配列の要素を左から右へと処理し、その結果を単一の出力値にまとめる高階関数のこと。
  // 第二引数で初期値を受け取る。
   const map = list.reduce((m, e) => m.set(e.id, e), new Map<V, E>())
 
   const sorted: typeof list = []
 
   let id = order[head]
   for (let i = list.length; i > 0; i--) {
     if (!id || id === head) break
 
     const e = map.get(id)
     if (e) sorted.push(e)
 
     id = order[id as Exclude<V, null>]
   }
 
   return sorted
 }

  /**
  * リストの順序情報を並べ替える PATCH リクエストのための情報を生成する
  *
  * @param order リストの順序情報
  * @param id 移動対象の ID
  * @param toID 移動先の ID
  */
  export function reorderPatch<V extends string | null>(
    order: Record<string, V>,
    id: Exclude<V, null>,
    toID: V = null as V,
  ) {
    const patch: Record<string, V> = {}
    if (id === toID || order[id] === toID) {
      return patch
    }
  
    const [deleteKey] = Object.entries(order).find(([, v]) => v && v === id) || []
    if (deleteKey) {
      patch[deleteKey] = order[id]
    }
  
    const [insertKey] =
      Object.entries(order).find(([, v]) => v && v === toID) || []
    if (insertKey) {
      patch[insertKey] = id as V
    }
  
    patch[id] = toID as V
  
    return patch
  }