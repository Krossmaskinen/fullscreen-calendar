<script>
	import { onMount } from 'svelte';
	import { getMonthData, getPrevMonth, getNextMonth } from '../helpers/helpers';
	let date = new Date();
	let monthData;
	let selectedDay;
	let showDayDetails = false;

	const selectDay = (day) => {
		selectedDay = day;
		showDayDetails = true;
	};

	const goBack = () => {
		showDayDetails = false;
	};

	const updateMonth = (newDate) => {
		date = newDate;
		monthData = getMonthData(date);
	};

	onMount(() => {
		monthData = getMonthData(date);
	});
</script>

{#if showDayDetails}
	<div class="full-screen">
		<button on:click={goBack}>Back</button>
		<h2>Selected day: {selectedDay.date.toDateString()}</h2>
		<p>{selectedDay.details}</p>
	</div>
{:else}
	<div>
		<button on:click={() => updateMonth(getPrevMonth(date))}>Previous</button>
		<button on:click={() => updateMonth(getNextMonth(date))}>Next</button>
	</div>

	<h2>{date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}</h2>

	{#if monthData}
		<div class="calendar">
			{#each monthData as day, index (index)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="day" on:click={() => selectDay(day)}>
					<h3>{day.date.getDate()}</h3>
					<p>{day.details}</p>
				</div>
			{/each}
		</div>
	{/if}
{/if}

<style>
	/* Add your styles here */
	.calendar {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
	}
	.day {
		cursor: pointer;
	}
	.full-screen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
