<script lang="ts">
    import { getEquipFormContext } from '../form-context/context'

    const { form, controls, register } = getEquipFormContext()
</script>

<fieldset class="input-container flex flex-col">
    <legend class="input-label">From</legend>

    <div class="flex items-center">
        <select use:register={'min_date_month'} class="select select-bordered w-full max-w-[24rem]">
            <option value="1">Jan</option>
            <option value="2">Feb</option>
            <option value="3">Mar</option>
            <option value="4">Apr</option>
            <option value="5">May</option>
            <option value="6">Jun</option>
            <option value="7">Jul</option>
            <option value="8">Aug</option>
            <option value="9">Sep</option>
            <option value="10">Oct</option>
            <option value="11">Nov</option>
            <option value="12">Dec</option>
        </select>

        <span class="w-[0.5rem] h-[1px] mx-2 bg-base-content"></span>

        <input
            use:register={'min_date_year'}
            class="input input-bordered"
            name="min_date_year"
            type="number"
            min="2016"
            max="2099"
            size="4"
        />
    </div>
</fieldset>

<style lang="postcss">
    input,
    select {
        min-height: 0;
        height: 2.5rem;
    }
</style>
