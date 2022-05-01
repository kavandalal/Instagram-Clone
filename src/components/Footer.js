import React from 'react';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';

const icon__style = { fontSize: '24px', height: '40px', width: '40px' };
function Footer() {
	return (
		<div className='flex flex-row-to-col bg-gray-800 text-white w-full p-10'>
			<div className='w-full md:w-1/2 p-4 text-md'>
				Tech Stack
				<ul className='p-4 text-2xl'>
					<li>- React.js</li>
					<li>- Node.js</li>
					<li>- Firebase (SQL + NoSQL)</li>
					<li>- Materail UI</li>
					<li>- Tailwind</li>
				</ul>
			</div>
			<div className='w-full md:w-1/2 before__line py-4 pr-4 pl-8 text-md'>
				Developer
				<div className=' flex justify-between p-4'>
					<span className='text-2xl'>Kavan Dalal</span>
					<span className='flex'>
						<div
							className='cursor-pointer ml-3'
							onClick={() => {
								navigator.clipboard.writeText('https://www.linkedin.com/in/kavan-dalal/');
								alert('Copied Linkedin Profile Link');
							}}>
							<LinkedInIcon style={icon__style} />
						</div>
						<div
							className='cursor-pointer ml-3'
							onClick={() => {
								navigator.clipboard.writeText('https://github.com/kavandalal');
								alert('Copied Github Link');
							}}>
							<GitHubIcon style={icon__style} />
						</div>
						<div
							className='cursor-pointer ml-3'
							onClick={() => {
								navigator.clipboard.writeText('kavandalal003@gmail.com');
								alert('Copied Mail');
							}}>
							<AlternateEmailIcon style={icon__style} />
						</div>
					</span>
				</div>
			</div>
		</div>
	);
}

export default Footer;
