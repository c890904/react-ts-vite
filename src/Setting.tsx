import { useState } from "react"
import { getCategory } from "./db/dbTool"
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { Backdrop, Box, Button, Fade, List, Modal, Select, Typography } from "@mui/material";

let load = false;

interface rowData {
  id: number
  main: string
  middle: string
  sub: string
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function showSetting() {
  const [rows, setRows] = useState([] as rowData[])
  const [select, setSelect] = useState([])
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'main', headerName: 'Main', width: 130 },
    { field: 'middle', headerName: 'Middle', width: 130 },
    { field: 'sub', headerName: 'SUb', width: 130 }];

  if (!load) {
    getCategory().then(datas => {
      let result = [] as rowData[]
      let resultSelect = [] as rowData[]
      datas.forEach(main => {
        let mainata = { id: main.id, main: main.name} as rowData
        result.push(mainata)
        resultSelect.push({ id: main.id, main: main.name, } as rowData)
        if (main.kids != null) {
          main.kids.forEach(middle => {
            let middleData = { id: middle.id, main: main.name, middle: middle.name } as rowData
            result.push(middleData)
            resultSelect.push({ id: middle.id, main: main.name + "/" + middle.name, } as rowData)
            if (middle.kids != null) {
              middle.kids.forEach(sub => {
                console.log(sub.name)
                let subData = { id: sub.id, main: main.name, middle: middle.name, sub: sub.name } as rowData
                result.push(subData)
              })
            }
          })
        }
      });

      setRows(result)
      let options = [];

      resultSelect.forEach(data => {
        options.push(
          <option value={data.id}>{data.main}</option>
        )
      })

      setSelect(options)

      load = true
    })
  }


  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        //        pageSize={5}
        //        rowsPerPageOptions={[5]}
        checkboxSelection
      />
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={modalStyle}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              項目追加
            </Typography>
            <Box sx={{ mt: 2 }} >
              <Typography id="transition-modal-description">
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
              <Select value={-1} label="category">
                {select}
        </Select>
              <input type="text"></input>
            </Box>
            <Button>送信</Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}