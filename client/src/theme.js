import { createTheme } from "@mui/material/styles";
const theme = createTheme({
  palette: {
    mode:"dark",
    primary:{main:"#6C63FF",light:"#8B85FF",dark:"#4A42CC"},
    secondary:{main:"#FF6584",light:"#FF8FA3"},
    background:{default:"#0A0A14",paper:"#13132A"},
    success:{main:"#00D4AA"},warning:{main:"#FFB347"},error:{main:"#FF6B6B"},
    text:{primary:"#EAEAEA",secondary:"#8888AA"},
    divider:"rgba(108,99,255,0.12)",
  },
  typography:{
    fontFamily:"'Inter',sans-serif",
    button:{fontWeight:600,textTransform:"none"},
    h4:{fontWeight:800},h5:{fontWeight:700},h6:{fontWeight:700},
  },
  shape:{borderRadius:12},
  components:{
    MuiButton:{styleOverrides:{root:{borderRadius:10,padding:"9px 22px"},containedPrimary:{background:"linear-gradient(135deg,#6C63FF,#8B85FF)",boxShadow:"0 4px 18px rgba(108,99,255,0.35)","&:hover":{boxShadow:"0 6px 24px rgba(108,99,255,0.5)"}}}},
    MuiPaper:{styleOverrides:{root:{backgroundImage:"none"}}},
    MuiCard:{styleOverrides:{root:{backgroundImage:"none",border:"1px solid rgba(108,99,255,0.1)"}}},
    MuiTextField:{styleOverrides:{root:{"& .MuiOutlinedInput-root":{borderRadius:10,"& fieldset":{borderColor:"rgba(108,99,255,0.2)"},"&:hover fieldset":{borderColor:"rgba(108,99,255,0.4)"},"&.Mui-focused fieldset":{borderColor:"#6C63FF"}}}}},
    MuiDialog:{styleOverrides:{paper:{backgroundImage:"none",border:"1px solid rgba(108,99,255,0.2)",borderRadius:20}}},
    MuiTab:{styleOverrides:{root:{textTransform:"none",fontWeight:600,minHeight:44}}},
    MuiChip:{styleOverrides:{root:{borderRadius:8,fontWeight:600}}},
  }
});
export default theme;
