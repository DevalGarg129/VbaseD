import { Box, CircularProgress, Typography } from "@mui/material";
import { motion } from "framer-motion";
export default function Loader({ message = "" }) {
  return (
    <Box sx={{ display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#0A0A14",gap:2 }}>
      <motion.div animate={{scale:[1,1.08,1],opacity:[0.7,1,0.7]}} transition={{duration:1.6,repeat:Infinity}}>
        <CircularProgress size={52} thickness={3} sx={{ color:"#6C63FF" }} />
      </motion.div>
      {message && <Typography variant="body2" color="text.secondary">{message}</Typography>}
    </Box>
  );
}
