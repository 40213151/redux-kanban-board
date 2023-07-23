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
  * リストを,あらかじめ決まっている順序に従ってソートした新しいリストを返す
  *
  * @param list カードリスト
  * @param order リストの順序情報
  * @param head カラムのID
  */
 export function sortBy<
  // Exclude<V, null> はstring型を示す。
   E extends { id: Exclude<V, null> },
   V extends string | null
   // list: E[]型の配列で、ソートするオブジェクトのリスト
   // order: Record<string, V> 型で、特定の順序を示すオブジェクト。
   //        このオブジェクトのキーは文字列で、値は V 型（string または null）
   // head: string型で、ソートの開始点を示すオブジェクトのid。
 >(list: E[], order: Record<string, V>, head: Exclude<V, null>) {
  // map: キーがid,valueがカードの各要素で構成されたマップオブジェクトの配列を生成している。
   const map = list.reduce((m, e) => m.set(e.id, e), new Map<V, E>())
  //  console.log('map' ,map)
   const sorted: typeof list = []

   let id = order[head]
  //  console.log('head' ,head)
  //  console.log('order[head]' ,order[head])
   // iの初期値はlistの長さで、iが0より大きい限りはループを実行して、iはだんだん1ずつ少なくなる。逆ループ。
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
  * @param order 変更前のリストの順序情報
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

    // console.log('order', order)
    // console.log('Object.entries(order)', Object.entries(order))
    // console.log('id', id)
    // console.log('toID', toID)
    // 2番目が真であり、かつ id と等しい要素をorderから探している。
    const [deleteKey] = Object.entries(order).find(([, v]) => v && v === id) || []
    if (deleteKey) {
      patch[deleteKey] = order[id]
    }
    // console.log('[deleteKey]', [deleteKey])
    // console.log('patch[deleteKey]', patch[deleteKey])
    // 2番目が真であり、かつ id と等しい要素をorderから探している。
    const [insertKey] = Object.entries(order).find(([, v]) => v && v === toID) || []
    if (insertKey) {
      patch[insertKey] = id as V
    }
    // console.log('[insertKey]', [insertKey])
    // console.log('patch[insertKey]', patch[insertKey])

    patch[id] = toID as V
    console.log('toID', toID)
    console.log('patch', patch)
    return patch
  }
