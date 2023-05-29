import { Link } from "react-router-dom";
import Button from "./Button";

const Tiles = ({ title, subTitle, buttonList, Icon, url }) => {
	return (
		<div className="flex flex-col col-span-full sm:col-span-3 xl:col-span-3 bg-white shadow-lg rounded-sm border border-neutral-200 rounded-md">
			<div className="px-5 py-5 text-center item-center block">
				<div className="flex flex-wrap items-center">
					<div className="relative w-full max-w-full text-center justify-center">
						<div className="text-white text-center inline-flex items-center justify-center w-16 h-16 text-ellipsis">
							{Icon ? (
								<Icon />
							) : (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width={80}
									height={80}
									viewBox="0 0 80 80"
									className="fill-gray-500"
								>
									<rect
										id="Rectangle_36"
										data-name="Rectangle 36"
										width={80}
										height={80}
										fill="none"
									/>
									<path
										className="text-indigo-500"
										id="total-pages"
										d="M29.736,61.964a14.366,14.366,0,0,1-4.583-3.141,14.64,14.64,0,0,1-1.9-2.386H4.1A4.152,4.152,0,0,1,0,52.274V4.163A4.152,4.152,0,0,1,4.1,0H39.088a4.152,4.152,0,0,1,4.091,4.163V36.147a14.644,14.644,0,0,1,5.455,6.606,14.923,14.923,0,0,1,0,11.412,14.616,14.616,0,0,1-3.089,4.659,14.375,14.375,0,0,1-4.583,3.141,14.241,14.241,0,0,1-11.226,0Zm-4.928-13.5a10.542,10.542,0,1,0,10.54-10.715A10.641,10.641,0,0,0,24.809,48.459Zm-16.4-25.22a2.157,2.157,0,0,0-.576,1.536A2.131,2.131,0,0,0,9.884,26.86H33.3a2.083,2.083,0,0,0,1.476-.672A2.156,2.156,0,0,0,33.3,22.567H9.884A2.09,2.09,0,0,0,8.409,23.239Zm14.569-7.212h.061a2.148,2.148,0,0,0,.06-4.294H10.124A2.119,2.119,0,0,0,8.013,13.82a2.158,2.158,0,0,0,.576,1.535,2.088,2.088,0,0,0,1.475.673H22.978Z"
										transform="translate(15.988 8.462)"
										stroke="rgba(0,0,0,0)"
										strokeMiterlimit={10}
										strokeWidth={1}
									/>
									<path
										className="text-indigo-500"
										id="Path_70"
										data-name="Path 70"
										d="M37.338,57.531V54.026H33.805v-2.42h3.533V48.1h2.355v3.506h3.542v2.42H39.694v3.506Z"
										transform="translate(12.293 3.821)"
									/>
								</svg>
							)}
						</div>
					</div>
					<div className="relative w-full max-w-full text-center">
						<div className="font-semibold text-xl text-gray-700">
							<Link
								to={`${url ? url : ""}`}
								title="Orders"
								className="font-semibold text-xl text-gray-700 hover:text-gray-900"
							>
								{title}
							</Link>
						</div>
						<div className="text-gray-400 uppercase font-bold text-xs text-center">{subTitle}</div>
						<div className="text-gray-400 uppercase font-bold text-xs mt-2">
							<div className="flex justify-center ml-1">
								{buttonList &&
									buttonList.map((value, key) => {
										return (
											<Button key={key} index={key} value={value} Icon={value.Icon} />
										);
									})}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
export default Tiles;
