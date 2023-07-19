import userIcon from 'assets/icons/userIcon.svg';
import creditCardIcon from 'assets/icons/creditCardIcon.svg';
import mapIcon from 'assets/icons/mapIcon.svg';
import circleInfoIcon from 'assets/icons/circleInfoIcon.svg';

interface Props {
  title: string;
  icon: string;
  data: string | number;
  withBorder?: boolean;
}

function renderIcon(icon: string) {
  switch (icon) {
    case 'user':
      return userIcon;
    case 'creditCard':
      return creditCardIcon;
    case 'map':
      return mapIcon;
    case 'circleInfo':
      return circleInfoIcon;
    default:
      return userIcon;
  }
}

const FooterCard = ({ title, icon, data, withBorder }: Props) => {
  return (
    <div className="flex items-center uppercase">
      <div className="p-6 flex items-center gap-4">
        <div className="w-[46px] h-[46px] flex justify-center items-center border-[1px] border-secondary-80 rounded-lg">
          <img src={renderIcon(icon)} alt="" className="w-[24px] h-[24px]" />
        </div>
        <div className="max-w-[191px] flex flex-col items-start gap-2 text-secondary-80">
          <p className="h-[24px] font-bold text-sm">{title}</p>
          <p className="text-[48px] font-medium">{data}</p>
        </div>
      </div>
      {withBorder && (
        <div className="w-[2px] h-[78px] ml-6 border-r-2 border-dashed border-secondary-80"></div>
      )}
    </div>
  );
};

export default FooterCard;
