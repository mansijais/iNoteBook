import Notes from './Notes';
// import showAlert from './Alert'
export const Home = (props) => {
const {showAlert}=props;
  return (
    <div>
      {/* <AddNote/> */}
      <Notes showAlert={showAlert} />
    </div>
  )
}
