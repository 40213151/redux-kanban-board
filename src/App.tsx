import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { api } from './api'
import { Header as _Header } from './Header'
import { Column } from './Column'
import { DeleteDialog } from './DeleteDialog'
import { Overlay as _Overlay } from './Overlay'

export function App() {
  const dispatch = useDispatch()
  // この関数は state が変化するたび呼び出され、
  // 選択した値（ここでは filterValue）が変化していればコンポーネントが再レンダリングされる。
  // 余計なレンダリングを抑えるために必要最低限の値を選ぶようにしよう。

  const columns = useSelector(state => state.columns)

  const cardIsBeingDeleted = useSelector(state => Boolean(state.deletingCardID))
  const cancelDelete = () =>
    dispatch({
      type: 'Dialog.CancelDelete',
    })


  useEffect(() => {
    ;(async () => {
      const columns = await api('GET /v1/columns', null)

      dispatch({
        type: 'App.SetColumns',
        payload: {
          columns,
        },
      })

      const [unorderedCards, cardsOrder] = await Promise.all([
        api('GET /v1/cards', null),
        api('GET /v1/cardsOrder', null),
      ])

      dispatch({
        type: 'App.SetCards',
        payload: {
          cards: unorderedCards,
          cardsOrder,
        },
      })
    })()
  }, [dispatch])

  return (
    <Container>
      <Header />

      <MainArea>
        <HorizontalScroll>
        {!columns ? (
             <Loading />
           ) : (
          columns.map(({ id }) => <Column key={id} id={id} />)
        )}
        </HorizontalScroll>
      </MainArea>

      {cardIsBeingDeleted && (
        <Overlay onClick={cancelDelete}>
          <DeleteDialog
          />
        </Overlay>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-flow: column;
  height: 100%;
`

const Header = styled(_Header)`
  flex-shrink: 0;
`

const MainArea = styled.div`
  height: 100%;
  padding: 16px 0;
  overflow-y: auto;
`

const HorizontalScroll = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow-x: auto;

  > * {
    margin-left: 16px;
    flex-shrink: 0;
  }

  ::after {
    display: block;
    flex: 0 0 16px;
    content: '';
  }
`

const Loading = styled.div.attrs({
  children: 'Loading...',
})`
  font-size: 14px;
`

const Overlay = styled(_Overlay)`
  display: flex;
  justify-content: center;
  align-items: center;
`
