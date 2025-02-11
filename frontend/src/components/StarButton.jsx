import styled from 'styled-components';

const StyledButton = styled.button`
  position: relative;
  padding: 12px 35px;
  background: #fec195;
  font-size: 17px;
  font-weight: 500;
  color: #181818;
  border: 3px solid #fec195;
  border-radius: 8px;
  box-shadow: 0 0 0 #fec1958c;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background: transparent;
    color: #fec195;
    box-shadow: 0 0 25px #fec1958c;
  }
`;

const StarBase = styled.div`
  position: absolute;
  filter: drop-shadow(0 0 0 #fffdef);
  z-index: -5;
`;

const Star1 = styled(StarBase)`
  top: 20%;
  left: 20%;
  width: 25px;
  transition: all 1s cubic-bezier(0.05, 0.83, 0.43, 0.96);

  ${StyledButton}:hover & {
    top: -80%;
    left: -30%;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }
`;

const Star2 = styled(StarBase)`
  top: 45%;
  left: 45%;
  width: 15px;
  transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);

  ${StyledButton}:hover & {
    top: -25%;
    left: 10%;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }
`;

const Star3 = styled(StarBase)`
  top: 40%;
  left: 40%;
  width: 5px;
  transition: all 1s cubic-bezier(0, 0.4, 0, 1.01);

  ${StyledButton}:hover & {
    top: 55%;
    left: 25%;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }
`;

const Star4 = styled(StarBase)`
  top: 20%;
  left: 40%;
  width: 8px;
  transition: all 0.8s cubic-bezier(0, 0.4, 0, 1.01);

  ${StyledButton}:hover & {
    top: 30%;
    left: 80%;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }
`;

const Star5 = styled(StarBase)`
  top: 25%;
  left: 45%;
  width: 15px;
  transition: all 0.6s cubic-bezier(0, 0.4, 0, 1.01);

  ${StyledButton}:hover & {
    top: 25%;
    left: 115%;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }
`;

const Star6 = styled(StarBase)`
  top: 5%;
  left: 50%;
  width: 5px;
  transition: all 0.8s ease;

  ${StyledButton}:hover & {
    top: 5%;
    left: 60%;
    filter: drop-shadow(0 0 10px #fffdef);
    z-index: 2;
  }
`;

const StarSvg = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    version="1.1"
    style={{
      shapeRendering: 'geometricPrecision',
      textRendering: 'geometricPrecision',
      imageRendering: 'optimizeQuality',
      fillRule: 'evenodd',
      clipRule: 'evenodd',
    }}
    viewBox="0 0 784.11 815.53"
  >
    <g id="Layer_x0020_1">
      <path
        d="M392.05 0c-20.9,210.08 -184.06,378.41 -392.05,407.78 207.96,29.37 371.12,197.68 392.05,407.74 20.93,-210.06 184.09,-378.37 392.05,-407.74 -207.98,-29.38 -371.16,-197.69 -392.06,-407.78z"
        fill="#fffdef"
      />
    </g>
  </svg>
);

const StarButton = ({ children }) => {
  return (
    <StyledButton>
      {children || 'Button'}
      <Star1><StarSvg /></Star1>
      <Star2><StarSvg /></Star2>
      <Star3><StarSvg /></Star3>
      <Star4><StarSvg /></Star4>
      <Star5><StarSvg /></Star5>
      <Star6><StarSvg /></Star6>
    </StyledButton>
  );
};

export default StarButton;