import "./Projects.css"

const ProjectsList = ({name, imagen, des, link, techused}) => {
  return (
    
      <div className="card">
          <div className="icon">
            <h3>{name}</h3>
          </div>
          <div className='row'>
          {techused && techused.map((tech, index) => (
            <div className='col-xl-3 col-lg-3 col-md-6 col-sm-12' key={index}>
              <p className='card-tech'>{tech.techname}</p>
            </div>
          ))}
          </div>
          <div className="card__body">
              {des}
          </div>
          <span>
            <a href={link} target="_blank"> 
              <img src={imagen} alt="budget" />
            </a>
          </span>
      </div>
    
  )
}

export default ProjectsList