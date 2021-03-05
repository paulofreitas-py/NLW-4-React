import { createContext, useContext, useEffect, useState } from 'react';
import { ICountdownContextData } from '../interfaces/ICountdownContextData';
import { ChallengesContext } from './ChallengesContext';
import { ICountdownProviderProps } from '../interfaces/ICountdownProviderProps';

export const CountdownContext = createContext({} as ICountdownContextData);

let countdownTimeout: NodeJS.Timeout;

export const CountdownProvider = ({ children }: ICountdownProviderProps) => {
	const { startNewChallenge } = useContext(ChallengesContext);

	const [time, setTime] = useState(25 * 60);
	const [isActive, setIsActive] = useState(false);
	const [hasFinished, setHasFinished] = useState(false);

	const minutes = Math.floor(time / 60);
	const seconds = time % 60;

	const startCountdown = () => {
		setIsActive(true);
	};

	const resetCountdown = () => {
		clearTimeout(countdownTimeout);

		setIsActive(false);
		setHasFinished(false);

		setTime(25 * 60); // reset time to initial value (25 min.)
	};

	useEffect(() => {
		if (isActive && time > 0) {
			countdownTimeout = setTimeout(() => {
				setTime(time - 1);
			}, 1000);
		} else if (isActive && time === 0) {
			setHasFinished(true);
			setIsActive(false);
			startNewChallenge();
		}
	}, [isActive, time]);

	return (
		<CountdownContext.Provider
			value={{
				minutes,
				seconds,
				hasFinished,
				isActive,
				startCountdown,
				resetCountdown,
			}}
		>
			{children}
		</CountdownContext.Provider>
	);
};
